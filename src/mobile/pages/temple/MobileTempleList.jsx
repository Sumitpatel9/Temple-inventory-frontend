import { useState, useEffect, useCallback } from "react";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileCard from "../../components/MobileCard";
import MobileStatusBadge from "../../components/MobileStatusBadge";
import MobileStatusModal from "../../components/MobileStatusModal";
import MobileFilterBar from "../../components/MobileFilterBar";
import MobileSortModal from "../../components/MobileSortModal";
import MobileCardField from "../../components/MobileCardField";
import { Pencil, Hash, MapPin, Activity } from "lucide-react";

const SORT_FIELDS = [
  { label: "Temple Name", value: "templeName" },
  { label: "Short Code", value: "templeCode" },
  { label: "Created Time", value: "createdAt" },
];

const initialForm = { templeName: "", templeCode: "", address: "", status: "Active" };

export default function MobileTempleList() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSort, setShowSort] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ show: false, message: "", type: "success" });

  const fetchTemples = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        Api.templelist,
        { search, status: statusFilter, sortField, sortOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTemples(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, statusFilter, sortField, sortOrder]);

  useEffect(() => { fetchTemples(); }, [fetchTemples]);

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.templeName.trim()) errs.templeName = "Temple Name is required";
    if (!formData.templeCode.trim()) errs.templeCode = "Short Code is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await axios.post(Api.templeupdate, { id: editId, ...formData }, { headers: { Authorization: `Bearer ${token}` } });
        setModal({ show: true, message: "Temple Updated successfully", type: "success" });
      } else {
        await axios.post(Api.templeadd, formData, { headers: { Authorization: `Bearer ${token}` } });
        setModal({ show: true, message: "Temple Created successfully", type: "success" });
      }
      setShowForm(false); setFormData(initialForm); setEditId(null); setErrors({});
      fetchTemples();
    } catch (err) {
      setModal({ show: true, message: err.response?.data?.message || "Something went wrong", type: "error" });
    }
  };

  const openEdit = (t) => {
    setFormData({ templeName: t.templeName || "", templeCode: t.templeCode || "", address: t.address || "", status: t.status || "Active" });
    setEditId(t._id); setShowForm(true);
  };

  return (
    <div className="p-4 space-y-3">
      <MobileStatusModal isOpen={modal.show} message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, show: false })} />

      <MobileFilterBar
        search={search} onSearchChange={(e) => setSearch(e.target.value)}
        status={statusFilter} onStatusChange={setStatusFilter}
        onAdd={() => { setFormData(initialForm); setEditId(null); setErrors({}); setShowForm(true); }}
        onSortOpen={() => setShowSort(true)}
      />

      {showSort && (
        <MobileSortModal
          fields={SORT_FIELDS}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={(f, o) => { setSortField(f); setSortOrder(o); }}
          onClose={() => setShowSort(false)}
        />
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : temples.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No Data Found</div>
      ) : (
        temples.map((t) => (
          <MobileCard key={t._id} accent={t.status === "Active" ? "green" : "red"}>
            {/* Card header */}
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{t.templeName}</p>
                <MobileStatusBadge status={t.status} />
              </div>
              <button
                onClick={() => openEdit(t)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 ml-2 shrink-0"
              >
                <Pencil size={13} className="text-gray-500" />
              </button>
            </div>

            {/* All fields */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <MobileCardField icon={<Hash size={12} />} value={t.templeCode} />
              <MobileCardField icon={<MapPin size={12} />} value={t.address || "—"} />
              <MobileCardField icon={<Activity size={12} />} value={t.status} />
            </div>
          </MobileCard>
        ))
      )}

      {/* Bottom sheet form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-gray-800 mb-4">{editId ? "Edit Temple" : "Add Temple"}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { name: "templeName", label: "Temple Name *", placeholder: "Enter temple name" },
                { name: "templeCode", label: "Short Code *", placeholder: "Enter short code" },
                { name: "address", label: "Address", placeholder: "Enter address" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
                  <input value={formData[f.name]} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                  {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold text-sm">Cancel</button>
                <button type="submit"
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm">{editId ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

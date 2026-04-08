import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileCard from "../../components/MobileCard";
import MobileCardField from "../../components/MobileCardField";
import MobileStatusBadge from "../../components/MobileStatusBadge";
import MobileStatusModal from "../../components/MobileStatusModal";
import MobileFilterBar from "../../components/MobileFilterBar";
import MobileSortModal from "../../components/MobileSortModal";
import MobileDateDisplay from "../../components/MobileDateDisplay";
import { Pencil, Trash2, Hash, Phone, User, Calendar, Clock, Package, AlignLeft } from "lucide-react";

const SORT_FIELDS = [
  { label: "Outward Name", value: "outwardName" },
  { label: "Outward No", value: "outwardNo" },
  { label: "Outward By", value: "outwardBy" },
  { label: "Outward Date", value: "outwardDate" },
  { label: "Created Time", value: "createdAt" },
];

export default function MobileOutwardMasterList() {
  const navigate = useNavigate();
  const [outwardList, setOutwardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Active");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSort, setShowSort] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", type: "success" });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, rowId: null });

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userRole = currentUser?.role;

  const fetchOutward = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = { search, sortField, sortOrder };
      if (status) body.status = status;
      const res = await axios.post(Api.outwardList, body, { headers: { Authorization: `Bearer ${token}` } });
      setOutwardList(res.data.data || res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, status, sortField, sortOrder]);

  useEffect(() => { fetchOutward(); }, [fetchOutward]);

  const handleDelete = async () => {
    const id = deleteConfirm.rowId;
    setDeleteConfirm({ show: false, rowId: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(Api.outwardDelete, { outwardId: id }, { headers: { Authorization: `Bearer ${token}` } });
      setModal({ show: true, message: res.data.message || "Deleted successfully", type: "success" });
      fetchOutward();
    } catch (err) {
      setModal({ show: true, message: err.response?.data?.message || "Delete failed", type: "error" });
    }
  };

  return (
    <div className="p-4 space-y-3">
      <MobileStatusModal isOpen={modal.show} message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, show: false })} />
      <MobileStatusModal isOpen={deleteConfirm.show} message="Delete this outward record?" type="confirm"
        onClose={() => setDeleteConfirm({ show: false, rowId: null })} onConfirm={handleDelete} />

      <MobileFilterBar
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        status={status}
        onStatusChange={setStatus}
        onAdd={() => navigate("/outward-detail-m")}
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
      ) : outwardList.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No Data Found</div>
      ) : (
        outwardList.map((row) => (
          <MobileCard key={row._id} accent={row.status === "Active" ? "green" : "red"}>
            {/* Header */}
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{row.outwardName || "—"}</p>
                <MobileStatusBadge status={row.status} />
              </div>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                <button onClick={() => navigate("/outward-detail-m", { state: { outwardData: row } })}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200 active:bg-gray-100">
                  <Pencil size={13} className="text-gray-500" />
                </button>
                {userRole === "Admin" && (
                  <button onClick={() => setDeleteConfirm({ show: true, rowId: row._id })}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 border border-red-100 active:bg-red-100">
                    <Trash2 size={13} className="text-red-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <MobileCardField icon={<Hash size={12} />} value={row.outwardNo} />
              <MobileCardField icon={<Phone size={12} />} value={row.outwardMobile} />
              <MobileCardField icon={<User size={12} />} value={row.outwardBy} />
              <MobileCardField icon={<Calendar size={12} />} value={row.outwardDate ? <MobileDateDisplay date={row.outwardDate} /> : null} />
              <MobileCardField icon={<Clock size={12} />} value={row.createdAt ? <MobileDateDisplay date={row.createdAt} /> : null} />
            </div>

            {/* Items always shown */}
            {row.items?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Items ({row.items.length})</p>
                {row.items.map((item, idx) => (
                  <div key={idx} className="bg-orange-50/60 rounded-xl px-3 py-2.5 space-y-1">
                    <p className="text-sm font-semibold text-gray-800">{item.productId?.productName || "Product"}</p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      <MobileCardField icon={<Package size={12} />} value={`${item.qty} ${item.productId?.uom || ""}`} />
                      <MobileCardField icon={<AlignLeft size={12} />} value={item.remarks} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MobileCard>
        ))
      )}
    </div>
  );
}

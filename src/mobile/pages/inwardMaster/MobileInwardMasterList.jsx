import { useState, useEffect } from "react";
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
import { Pencil, Trash2, Hash, Phone, MapPin, User, Calendar, Clock, Package, Tag, AlignLeft } from "lucide-react";

const SORT_FIELDS = [
  { label: "Vendor Name", value: "vendorName" },
  { label: "Challan No", value: "challanNo" },
  { label: "Inward By", value: "inwardBy" },
  { label: "Inward Date", value: "inwardDate" },
  { label: "Created Time", value: "createdAt" },
];

export default function MobileInwardMasterList() {
  const navigate = useNavigate();
  const [inwardList, setInwardList] = useState([]);
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

  const fetchInward = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = { search, sortField, sortOrder };
      if (status) body.status = status;
      const res = await axios.post(Api.inwardList, body, { headers: { Authorization: `Bearer ${token}` } });
      setInwardList(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInward(); }, [search, status, sortField, sortOrder]);

  const handleDelete = async () => {
    const id = deleteConfirm.rowId;
    setDeleteConfirm({ show: false, rowId: null });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(Api.inwardDelete, { inwardId: id }, { headers: { Authorization: `Bearer ${token}` } });
      setModal({ show: true, message: res.data.message || "Deleted successfully", type: "success" });
      fetchInward();
    } catch (err) {
      setModal({ show: true, message: err.response?.data?.message || "Delete failed", type: "error" });
    }
  };

  return (
    <div className="p-4 space-y-3">
      <MobileStatusModal isOpen={modal.show} message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, show: false })} />
      <MobileStatusModal isOpen={deleteConfirm.show} message="Delete this inward record?" type="confirm"
        onClose={() => setDeleteConfirm({ show: false, rowId: null })} onConfirm={handleDelete} />

      <MobileFilterBar
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        status={status}
        onStatusChange={setStatus}
        onAdd={() => navigate("/inward-detail-m")}
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
      ) : inwardList.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No Data Found</div>
      ) : (
        inwardList.map((row) => (
          <MobileCard key={row._id} accent={row.status === "Active" ? "green" : "red"}>
            {/* Header */}
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{row.vendorName || "—"}</p>
                <MobileStatusBadge status={row.status} />
              </div>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                <button onClick={() => navigate("/inward-detail-m", { state: { inwardData: row } })}
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
              <MobileCardField icon={<Hash size={12} />} value={row.challanNo} />
              <MobileCardField icon={<Phone size={12} />} value={row.vendorMobile} />
              <MobileCardField icon={<MapPin size={12} />} value={row.vendorAddress} />
              <MobileCardField icon={<User size={12} />} value={row.inwardBy} />
              <MobileCardField icon={<Calendar size={12} />} value={row.inwardDate ? <MobileDateDisplay date={row.inwardDate} /> : null} />
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
                      <MobileCardField icon={<Tag size={12} />} value={item.batchNo} />
                      <MobileCardField icon={<Calendar size={12} />} value={item.expDate} />
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

import { useState, useEffect, useCallback } from "react";
import { ArrowUpDown, Tag, Warehouse, Building2, Calendar } from "lucide-react";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileStatusBadge from "../../components/MobileStatusBadge";
import MobileSearchBar from "../../components/MobileSearchBar";
import MobileSortModal from "../../components/MobileSortModal";

const SORT_FIELDS = [
  { label: "Product Name", value: "productName" },
  { label: "Category", value: "category" },
  { label: "Current Stock", value: "currentStock" },
  { label: "Last Outward Date", value: "lastOutwardDate" },
];

export default function MobileSlowMovingReport() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [days, setDays] = useState(30);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSort, setShowSort] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = { search, days, status: "Active" };
      if (sortField) { body.sortField = sortField; body.sortOrder = sortOrder; }
      const res = await axios.post(Api.slowMovingStock, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, days, sortField, sortOrder]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="p-4 space-y-3">
      {/* Search + Sort row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <MobileSearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button
          onClick={() => setShowSort(true)}
          className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs shrink-0 transition-colors ${
            sortField ? "bg-orange-50 border-orange-300 text-orange-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <ArrowUpDown size={14} />
          <span>Sort</span>
        </button>
      </div>

      <select value={days} onChange={(e) => setDays(Number(e.target.value))}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
        <option value={30}>Last 30 Days</option>
        <option value={60}>Last 60 Days</option>
        <option value={90}>Last 90 Days</option>
      </select>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No Data Found</div>
      ) : (
        products.map((p, i) => (
          <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-gray-800">{p.productName}</p>
              <MobileStatusBadge status={p.status} />
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1"><Tag size={12} className="text-gray-400" /><span className="text-gray-600">{p.category}</span></div>
            <div className="flex items-center gap-1.5 text-xs"><Warehouse size={12} className="text-gray-400" /><span className="text-gray-500">{p.warehouseReck}</span><Building2 size={12} className="text-gray-400 ml-2" /><span className="text-gray-500">{p.templeName || "—"}</span></div>
            <div className="flex gap-4 mt-2 flex-wrap">
              <span className="text-xs text-gray-500">Min: {p.minQty} {p.uom}</span>
              <span className="text-xs font-semibold text-gray-700">Stock: {p.currentStock} {p.uom}</span>
              {p.lastOutwardDate && <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={11} />{p.lastOutwardDate}</span>}
            </div>
          </div>
        ))
      )}

      {showSort && (
        <MobileSortModal
          fields={SORT_FIELDS}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={(f, o) => { setSortField(f); setSortOrder(o); }}
          onClose={() => setShowSort(false)}
        />
      )}
    </div>
  );
}

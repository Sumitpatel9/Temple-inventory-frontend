import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, ChevronRight, Tag, Warehouse, Ruler, BarChart2, Building2, Calendar } from "lucide-react";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileCard from "../../components/MobileCard";
import MobileCardField from "../../components/MobileCardField";
import MobileStatusBadge from "../../components/MobileStatusBadge";
import MobileSearchBar from "../../components/MobileSearchBar";
import MobileDateDisplay from "../../components/MobileDateDisplay";
import MobileSortModal from "../../components/MobileSortModal";

const SORT_FIELDS = [
  { label: "Product Name", value: "productName" },
  { label: "Category", value: "category" },
  { label: "Current Stock", value: "currentStock" },
  { label: "Min Qty", value: "minQty" },
  { label: "Created At", value: "createdAt" },
];

export default function MobileStock() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Active");
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSort, setShowSort] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = { search, category };
      if (status) body.status = status;
      if (sortField) { body.sortField = sortField; body.sortOrder = sortOrder; }
      const res = await axios.post(Api.productList, body, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, status, category, sortField, sortOrder]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(Api.productCategory, {}, { headers: { Authorization: `Bearer ${token}` } });
      setCategoryOptions(res.data.map((c) => ({ label: c, value: c })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const isLowStock = (p) => Number(p.currentStock) < Number(p.minQty);

  return (
    <div className="p-4 space-y-3">
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

      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white text-xs font-medium shrink-0">
          {["", "Active", "Deactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-2 transition ${status === s ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {s === "" ? "All" : s}
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none text-gray-600"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No Data Found</div>
      ) : (
        products.map((p) => (
          <MobileCard
            key={p._id}
            accent={p.status === "Active" ? "green" : "red"}
            onClick={() => navigate(`/stock-m/${p._id}`, { state: { product: p } })}
          >
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{p.productName}</p>
                <MobileStatusBadge status={p.status} />
              </div>
              <ChevronRight size={18} className="text-gray-400 ml-2 shrink-0 mt-0.5" />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <MobileCardField icon={<Tag size={12} />} value={p.category} />
              <MobileCardField icon={<Warehouse size={12} />} value={p.warehouseReck} />
              <MobileCardField icon={<Ruler size={12} />} value={p.uom} />
              <MobileCardField icon={<BarChart2 size={12} />} value={p.minQty} />
              <MobileCardField icon={<Building2 size={12} />} value={p.templeName} />
              <MobileCardField icon={<Calendar size={12} />} value={p.lastInwardDate ? <MobileDateDisplay date={p.lastInwardDate} /> : null} />
              <MobileCardField icon={<Calendar size={12} />} value={p.lastOutwardDate ? <MobileDateDisplay date={p.lastOutwardDate} /> : null} />
            </div>
            <div className="flex gap-2 mt-2.5 flex-wrap">
              <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                Min {p.minQty} {p.uom}
              </span>
              <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold ${isLowStock(p) ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                {isLowStock(p) ? "Low Stock - " : ""}Stock: {p.currentStock} {p.uom}
              </span>
            </div>
          </MobileCard>
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

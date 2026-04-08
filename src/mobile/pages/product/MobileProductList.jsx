import { useState, useEffect, useCallback } from "react";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileCard from "../../components/MobileCard";
import MobileCardField from "../../components/MobileCardField";
import MobileStatusBadge from "../../components/MobileStatusBadge";
import MobileStatusModal from "../../components/MobileStatusModal";
import MobileFilterBar from "../../components/MobileFilterBar";
import MobileSortModal from "../../components/MobileSortModal";
import MobileDateDisplay from "../../components/MobileDateDisplay";
import { Pencil, Tag, Warehouse, Ruler, BarChart2, Building2, Calendar } from "lucide-react";

const SORT_FIELDS = [
  { label: "Product Name", value: "productName" },
  { label: "Category", value: "category" },
  { label: "Warehouse Reck", value: "warehouseReck" },
  { label: "Min Qty", value: "minQty" },
  { label: "Created Time", value: "createdAt" },
];

const uomOptions = ["Select UOM","berrual","box","cm","dz","ft","gm","in","kg","km","ltr","mg","ml","nos","psc"];
const initialForm = { category: "", productName: "", uom: "", minQty: "", warehouseReck: "", status: "Active" };

export default function MobileProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Active");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSort, setShowSort] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ show: false, message: "", type: "success" });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = { search, sortField, sortOrder };
      if (status) body.status = status;
      const res = await axios.post(Api.productList, body, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, status, sortField, sortOrder]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSave = async (e) => {
    e.preventDefault();
    const required = ["category", "productName", "uom", "minQty", "warehouseReck"];
    const errs = {};
    required.forEach((f) => { if (!formData[f] || !String(formData[f]).trim()) errs[f] = "This field is required";
});
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await axios.post(Api.productUpdate, { id: editId, ...formData }, { headers: { Authorization: `Bearer ${token}` } });
        setModal({ show: true, message: "Product Updated successfully", type: "success" });
      } else {
        await axios.post(Api.productCreate, formData, { headers: { Authorization: `Bearer ${token}` } });
        setModal({ show: true, message: "Product Created successfully", type: "success" });
      }
      setShowForm(false);
      setFormData(initialForm);
      setEditId(null);
      setErrors({});
      fetchProducts();
    } catch (err) {
      setModal({ show: true, message: err.response?.data?.message || "Something went wrong", type: "error" });
    }
  };

  const openEdit = (p) => {
    setFormData({ category: p.category || "", productName: p.productName || "", uom: p.uom || "", minQty: p.minQty || "", warehouseReck: p.warehouseReck || "", status: p.status || "Active" });
    setEditId(p._id);
    setShowForm(true);
  };

  const isLowStock = (p) => Number(p.currentStock) < Number(p.minQty);

  return (
    <div className="p-4 space-y-3">
      <MobileStatusModal isOpen={modal.show} message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, show: false })} />

      <MobileFilterBar
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        status={status}
        onStatusChange={setStatus}
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
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No Data Found</div>
      ) : (
        products.map((p) => (
          <MobileCard key={p._id} accent={p.status === "Active" ? "green" : "red"}>
            {/* Header */}
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm leading-tight">{p.productName}</p>
                <MobileStatusBadge status={p.status} />
              </div>
              <button
                onClick={() => openEdit(p)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200 active:bg-gray-100 ml-2 shrink-0"
              >
                <Pencil size={13} className="text-gray-500" />
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <MobileCardField icon={<Tag size={12} />} value={p.category} />
              <MobileCardField icon={<Warehouse size={12} />} value={p.warehouseReck} />
              <MobileCardField icon={<Ruler size={12} />} value={p.uom} />
              <MobileCardField icon={<BarChart2 size={12} />} value={p.minQty} />
              <MobileCardField icon={<Building2 size={12} />} value={p.templeName} />
              <MobileCardField icon={<Calendar size={12} />} value={p.lastInwardDate ? <MobileDateDisplay date={p.lastInwardDate} /> : null} />
              <MobileCardField icon={<Calendar size={12} />} value={p.lastOutwardDate ? <MobileDateDisplay date={p.lastOutwardDate} /> : null} />
            </div>

            {/* Stock row */}
            <div className="flex gap-2 mt-2.5 flex-wrap">
              <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                Min {p.minQty} {p.uom}
              </span>
              <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold ${
                isLowStock(p) ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
              }`}>
                {isLowStock(p) ? "⚠ Low Stock — " : ""}Stock: {p.currentStock} {p.uom}
              </span>
            </div>
          </MobileCard>
        ))
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { name: "category", label: "Category", placeholder: "Category" },
                { name: "productName", label: "Product Name", placeholder: "Product name" },
                { name: "warehouseReck", label: "Warehouse Reck", placeholder: "Warehouse reck" },
              ].map((f) => (
                <div key={f.name}>
                  <label className=
"text-sm font-medium text-gray-600 block mb-1">{f.label}</label>
                  <input value={formData[f.name]} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                  {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">UOM</label>
                <select value={formData.uom} onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                  {uomOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.uom && <p className="text-red-500 text-xs mt-1">{errors.uom}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Min Qty</label>
                <input type="text" inputMode="numeric" value={formData.minQty}
                  onChange={(e) => { if (/^\d*$/.test(e.target.value)) setFormData({ ...formData, minQty: e.target.value }); }}
                  placeholder="Min quantity"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                {errors.minQty && <p className="text-red-500 text-xs mt-1">{errors.minQty}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 font-semibold">Cancel</button>
                <button type="submit"
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold">{editId ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

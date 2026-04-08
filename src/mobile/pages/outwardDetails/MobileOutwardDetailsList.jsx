import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileStatusModal from "../../components/MobileStatusModal";
import Select from "react-select";
import { Trash2, Plus } from "lucide-react";

export default function MobileOutwardDetailsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.outwardData;
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    outwardName: "", outwardMobile: "", outwardNo: "", outwardDate: "", description: "",
  });
  const [rows, setRows] = useState([{ product: "", remarks: "", qty: "", uom: "" }]);
  const [productOptions, setProductOptions] = useState([]);
  const [modal, setModal] = useState({ open: false, message: "", type: "" });

  const closeModal = () => {
    setModal({ ...modal, open: false });
    if (modal.type === "success") navigate("/outward-m");
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(Api.productList, {}, { headers: { Authorization: `Bearer ${token}` } });
      const products = res.data.data || res.data;
      setProductOptions(products.map((item) => ({
        value: item._id, label: item.productName, stock: item.currentStock, uom: item.uom,
      })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        outwardName: editData.outwardName || "", outwardMobile: editData.outwardMobile || "",
        outwardNo: editData.outwardNo || "",
        outwardDate: editData.outwardDate ? new Date(editData.outwardDate).toISOString().split("T")[0] : "",
        description: editData.description || "",
      });
      setRows(editData.items?.map((item) => ({
        product: item.productId?._id || item.productId, remarks: item.remarks || "", qty: item.qty || "", uom: "",
      })) || []);
    }
  }, [editData]);

  const handleSave = async () => {
    if (!formData.outwardName || !formData.outwardNo) {
      setModal({ open: true, message: "Customer Name and Outward No are required", type: "error" }); return;
    }
    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].product) { setModal({ open: true, message: `Select product for row ${i + 1}`, type: "error" }); return; }
      if (!rows[i].qty || Number(rows[i].qty) <= 0) { setModal({ open: true, message: `Valid qty required for row ${i + 1}`, type: "error" }); return; }
    }
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        outwardDate: formData.outwardDate ? new Date(formData.outwardDate) : new Date(),
        items: rows.map((r) => ({ productId: r.product, remarks: r.remarks, qty: Number(r.qty) })),
      };
      let res;
      if (isEditMode) {
        res = await axios.post(Api.outwardUpdate, { outwardId: editData._id, ...payload }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        res = await axios.post(Api.outwardCreate, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setModal({ open: true, message: res.data.message || "Saved successfully", type: "success" });
    } catch (err) {
      setModal({ open: true, message: err.response?.data?.message || "Failed to save", type: "error" });
    }
  };

  const addRow = () => setRows([...rows, { product: "", remarks: "", qty: "", uom: "" }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => { const u = [...rows]; u[i][field] = val; setRows(u); };

  return (
    <div className="p-4 pb-6 space-y-4">
      <MobileStatusModal isOpen={modal.open} message={modal.message} type={modal.type} onClose={closeModal} />

      <h2 className="text-lg font-semibold text-orange-500">{isEditMode ? "Edit Outward Entry" : "New Outward Entry"}</h2>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
        {[
          { name: "outwardName", label: "Customer Name *", placeholder: "Customer name" },
          { name: "outwardMobile", label: "Mobile No.", placeholder: "Mobile number" },
          { name: "outwardNo", label: "Outward No. *", placeholder: "Outward number" },
        ].map((f) => (
          <div key={f.name}>
            <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
            <input value={formData[f.name]} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">Outward Date</label>
          <input type="date" value={formData.outwardDate} onChange={(e) => setFormData({ ...formData, outwardDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description" rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-orange-500 mb-2">Item Details</h3>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm space-y-2 relative">
              <button onClick={() => removeRow(i)} className="absolute top-3 right-3 text-red-400">
                <Trash2 size={16} />
              </button>
              <p className="text-xs font-semibold text-gray-500">Item {i + 1}</p>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Product *</label>
                <Select
                  options={productOptions}
                  value={productOptions.find((p) => p.value === row.product) || null}
                  onChange={(sel) => { updateRow(i, "product", sel?.value || ""); updateRow(i, "uom", sel?.uom || ""); }}
                  placeholder="Select product" isClearable classNamePrefix="rs"
                  styles={{ control: (b) => ({ ...b, borderRadius: "8px", minHeight: "40px" }) }}
                  formatOptionLabel={(d, { context }) => context === "value" ? <span>{d.label}</span> : (
                    <div>
                      <div className="font-medium">{d.label}</div>
                      <div className="text-xs text-gray-400">Stock: {d.stock} {d.uom}</div>
                    </div>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Qty *</label>
                  <div className="relative">
                    <input type="text" inputMode="numeric" value={row.qty}
                      onChange={(e) => { if (/^\d*$/.test(e.target.value)) updateRow(i, "qty", e.target.value); }}
                      placeholder="Qty"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none pr-10" />
                    {row.uom && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">{row.uom}</span>}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Remarks</label>
                  <input value={row.remarks} onChange={(e) => updateRow(i, "remarks", e.target.value)} placeholder="Remarks"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addRow}
          className="mt-3 w-full py-2.5 border-2 border-dashed border-orange-300 text-orange-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
          <Plus size={16} /> Add Row
        </button>
      </div>

      <div className="flex gap-3">
        <button onClick={() => navigate(-1)}
          className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold">Cancel</button>
        <button onClick={handleSave}
          className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold">{isEditMode ? "Update" : "Save"}</button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Input from "../../conponents/ui/Input";
import Button from "../../conponents/ui/Button";
import CommonSelect from "../../conponents/ui/CommonSelect";
import { Api } from "../../services/api";
import axios from "../../services/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import StatusModal from "../../conponents/ui/StatusModal";

export default function InwardDetailsList() {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    open: false,
    message: "",
    type: "",
  });
  const closeModal = () => {
    setModal({ ...modal, open: false });
    if (modal.type === "success") {
      navigate("/inward");
    }
  };
  // ===============================
  // Top Form State
  // ===============================
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorMobile: "",
    vendorAddress: "",
    challanNo: "",
    inwardDate: "",
    description: "",
  });

  // ===============================
  // Item Rows State
  // ===============================
  const [rows, setRows] = useState([
    {
      product: "",
      remarks: "",
      qty: "",
      uom: "",
      batch: "",
      expDate: "",
    },
  ]);

  const [productOptions, setProductOptions] = useState([]);

  const location = useLocation();
  const editData = location.state?.inwardData;
  const isEditMode = !!editData;

  // ===============================
  // Handle Top Form Change
  // ===============================
  const handleTopChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // Row Functions
  // ===============================
  const addRow = () => {
    setRows([
      ...rows,
      { product: "", remarks: "", qty: "", uom: "", batch: "", expDate: "" },
    ]);
  };

  const removeRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // ===============================
  // Save Inward
  // ===============================
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setModal({
          open: true,
          message: "Please login again ❌",
          type: "error",
        });
        return;
      }

      // ==========================================
      // 1. Validation: Only Challan No for Top Form
      // ==========================================
      if (!formData.challanNo || !formData.challanNo.trim()) {
        setModal({
          open: true,
          message: "Challan number is required", // Matches error in
          type: "error",
        });
        return;
      }

      // ==========================================
      // 2. Validation: All fields for Item Rows
      // ==========================================
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.product || !row.qty || !row.batch || !row.expDate) {
          setModal({
            open: true,
            message: `Please fill all details for Item row ${i + 1} ❌`,
            type: "error",
          });
          return;
        }
        if (Number(row.qty) <= 0) {
          setModal({
            open: true,
            message: `Invalid quantity in row ${i + 1} ❌`,
            type: "error",
          });
          return;
        }
      }

      // ==========================================
      // 3. Payload Construction
      // ==========================================
      const payload = {
        vendorName: formData.vendorName,
        vendorMobile: formData.vendorMobile,
        vendorAddress: formData.vendorAddress,
        challanNo: formData.challanNo,
        inwardDate: formData.inwardDate,
        description: formData.description,
        items: rows.map((row) => ({
          productId: row.product,
          remarks: row.remarks,
          qty: Number(row.qty),
          batchNo: row.batch,
          expDate: row.expDate,
        })),
      };

      // ==========================================
      // 4. API Call & Success Handling
      // ==========================================
      let res;

      if (isEditMode) {
        res = await axios.post(
          Api.inwardUpdate,
          {
            inwardId: editData._id,
            ...payload,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        res = await axios.post(Api.inwardCreate, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setModal({
        open: true,
        message: res.data.message || "Inward created successfully ✅",
        type: "success",
      });
    } catch (error) {
      // Handles specific backend errors like "Challan number already exists"
      setModal({
        open: true,
        message:
          error.response?.data?.message || "Failed to create inward record!",
        type: "error",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        Api.productList, // serverip + "/products/list"
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Adjust according to backend response
      const products = res.data.data || res.data;

      const formatted = products.map((item) => ({
        value: item._id,
        label: item.productName,
        reck: item.warehouseReck,
        category: item.category,
        stock: item.currentStock,
        uom: item.uom,
      }));

      setProductOptions(formatted);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        vendorName: editData.vendorName || "",
        vendorMobile: editData.vendorMobile || "",
        vendorAddress: editData.vendorAddress || "",
        challanNo: editData.challanNo || "",
        inwardDate: editData.inwardDate
          ? new Date(editData.inwardDate).toISOString().split("T")[0]
          : "",
        description: editData.description || "",
      });

      setRows(
        editData.items?.map((item) => ({
          product: item.productId?._id || item.productId,
          remarks: item.remarks || "",
          qty: item.qty || "",
          batch: item.batchNo || "",
          expDate: item.expDate || "",
        })) || [],
      );
    }
  }, [editData]);

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-[#FF6900] mb-4">
        {isEditMode ? "Edit Inward Entry" : "New Inward Entry"}
      </h2>

      {/* Top Form */}
      <div className="bg-white border rounded px-4 py-3 shadow-sm mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Vendor Name
            </label>
            <Input
              name="vendorName"
              value={formData.vendorName}
              onChange={handleTopChange}
              placeholder="Enter vendor name"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Vendor Mobile No.
            </label>
            <Input
              name="vendorMobile"
              value={formData.vendorMobile}
              onChange={handleTopChange}
              placeholder="Enter vendor mobile number"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Vendor Address
            </label>
            <Input
              name="vendorAddress"
              value={formData.vendorAddress}
              onChange={handleTopChange}
              placeholder="Enter vendor address"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Inward Challan No.
            </label>
            <Input
              name="challanNo"
              value={formData.challanNo}
              onChange={handleTopChange}
              placeholder="Enter inward challan no."
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Inward Date
            </label>
            <Input
              type="date"
              name="inwardDate"
              value={formData.inwardDate}
              onChange={handleTopChange}
              onFocus={(e) => e.target.showPicker()}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm font-semibold text-gray-600">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleTopChange}
            className="w-full border rounded px-3 py-2 mt-1 resize-y min-h-[100px]"
            placeholder="Enter description"
          />
        </div>
      </div>

      {/* Item Details */}
      <h3 className="text-lg font-semibold text-[#FF6900] mb-3">
        Item Details
      </h3>

      <div className="bg-white border-b rounded shadow-sm flex flex-col">
        {/* HEADER */}
        <div className="bg-[#F3F4F6] px-4 py-3 border-t rounded">
          <div className="grid grid-cols-[60px_2fr_2fr_1fr_1.5fr_1.5fr] gap-3 text-sm font-semibold text-gray-600">
            <div>Action</div>
            <div>Product</div>
            <div>Remarks</div>
            <div>Qty</div>
            <div>Batch No.</div>
            <div>Exp. Date</div>
          </div>
        </div>

        {/* SCROLL AREA */}
        <div className="overflow-y-auto flex-1 px-4 py-3">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-[60px_2fr_2fr_1fr_1.5fr_1.5fr] gap-3 mb-3 items-center"
            >
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition cursor-pointer"
              >
                ✕
              </button>

              <CommonSelect
                options={productOptions}
                value={row.product}
                onChange={(val) => {
                  const selected = productOptions.find((p) => p.value === val);

                  const updated = [...rows];
                  updated[index].product = val;
                  updated[index].uom = selected?.uom || "";

                  setRows(updated);
                }}
                placeholder="Select Product"
                detailFields={[
                  { key: "reck", label: "Reck" },
                  { key: "category", label: "Category" },
                  { key: "stock", label: "Stock" },
                ]}
              />

              <Input
                className="w-full border rounded px-2 py-2"
                placeholder="Remarks"
                value={row.remarks}
                onChange={(e) => handleChange(index, "remarks", e.target.value)}
              />

              <div className="relative">
                <Input
                  type="text"
                  className="w-full border rounded px-2 py-2 pr-12" 
                  placeholder="Qty"
                  value={row.qty}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleChange(index, "qty", value);
                    }
                  }}
                />
                {row.uom && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-xs font-bold pointer-events-none">
                    {row.uom}
                  </span>
                )}
              </div>

              <Input
                className="w-full border rounded px-2 py-2"
                placeholder="Batch"
                value={row.batch}
                onChange={(e) => handleChange(index, "batch", e.target.value)}
              />

              <Input
                type="text"
                className="w-full border rounded px-2 py-2"
                placeholder="Exp. Date"
                value={row.expDate}
                onChange={(e) => handleChange(index, "expDate", e.target.value)}
              />
            </div>
          ))}
        </div>
        <StatusModal
          isOpen={modal.open}
          message={modal.message}
          type={modal.type}
          onClose={closeModal}
        />
      </div>
      {/* ADD ROW BUTTON */}
      <button
        type="button"
        onClick={addRow}
        className="mt-2 bg-[#FF6900] text-white px-4 py-2 rounded hover:opacity-90 cursor-pointer"
      >
        Add New Row
      </button>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="inwardform" onClick={handleSave}>
          {isEditMode ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
}

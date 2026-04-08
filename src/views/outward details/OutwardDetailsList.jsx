import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../conponents/ui/Input";
import Button from "../../conponents/ui/Button";
import CommonSelect from "../../conponents/ui/CommonSelect";
import axios from "../../services/axiosInstance";
import { Api } from "../../services/api";
import StatusModal from "../../conponents/ui/StatusModal";

export default function OutwardDetailsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.outwardData;
  const isEditMode = !!editData;
  const [productOptions, setProductOptions] = useState([]);
  /* ================= MODAL STATE ================= */
  const [modal, setModal] = useState({
    open: false,
    message: "",
    type: "",
  });

  const closeModal = () => {
    setModal({ ...modal, open: false });
    if (modal.type === "success") {
      navigate("/outward");
    }
  };

  /* ================= TOP FORM STATE ================= */

  const [formData, setFormData] = useState({
    outwardName: "",
    outwardMobile: "",
    outwardNo: "",
    outwardDate: "",
    description: "",
  });

  /* ================= ROW STATE ================= */

  const [rows, setRows] = useState([
    {
      product: "",
      remarks: "",
      qty: "",
      uom: "",
    },
  ]);

  /* ================= HANDLE TOP FORM ================= */

  const handleTopChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= ROW FUNCTIONS ================= */

  const addRow = () => {
    setRows([...rows, { product: "", remarks: "", qty: "", uom: "" }]);
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

  /* ================= SAVE OUTWARD ================= */
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

      // Front-end Validation
      for (let row of rows) {
        if (!row.product) {
          setModal({
            open: true,
            message: "Please select product ❌",
            type: "error",
          });
          return;
        }
        if (!row.qty || Number(row.qty) <= 0) {
          setModal({
            open: true,
            message: "Please enter valid quantity ❌",
            type: "error",
          });
          return;
        }
      }

      if (!formData.outwardName || !formData.outwardNo) {
        setModal({
          open: true,
          message: "Customer Name and Outward No are required ❌",
          type: "error",
        });
        return;
      }

      let res;

      if (isEditMode) {
        const updatePayload = {
          outwardId: editData._id,
          outwardName: formData.outwardName,
          outwardMobile: formData.outwardMobile,
          outwardNo: formData.outwardNo,
          outwardDate: formData.outwardDate
            ? new Date(formData.outwardDate)
            : new Date(),
          description: formData.description,

          items: rows.map((row) => ({
            productId: row.product,
            remarks: row.remarks,
            qty: Number(row.qty),
          })),
        };

        // console.log("Update payload:", updatePayload);

        res = await axios.post(Api.outwardUpdate, updatePayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const payload = {
          outwardName: formData.outwardName,
          outwardMobile: formData.outwardMobile,
          outwardNo: formData.outwardNo,
          outwardDate: formData.outwardDate
            ? new Date(formData.outwardDate)
            : new Date(),
          description: formData.description,
          items: rows.map((row) => ({
            productId: row.product,
            remarks: row.remarks,
            qty: Number(row.qty),
          })),
        };

        res = await axios.post(Api.outwardCreate, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setModal({
        open: true,
        message: res.data.message || "Outward created successfully ✅",
        type: "success",
      });
    } catch (error) {
      // ✅ Improved Error Handling to solve the specific errors from your logs
      const errorMsg = error.response?.data?.message || "Server Error ❌";
      console.error("Outward Error:", errorMsg);

      setModal({
        open: true,
        message: errorMsg, // This will show "Outward number already exists" or "Insufficient stock"
        type: "error",
      });
    }
  };

  /* ================= PRODUCT OPTIONS ================= */

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        Api.productList,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const products = res.data.data || res.data;

      const formatted = products.map((item) => ({
        value: item._id,
        label: item.productName,
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
        outwardName: editData.outwardName || "",
        outwardMobile: editData.outwardMobile || "",
        outwardNo: editData.outwardNo || "",
        outwardDate: editData.outwardDate
          ? new Date(editData.outwardDate).toISOString().split("T")[0]
          : "",
        description: editData.description || "",
      });

      setRows(
        editData.items?.map((item) => ({
          product: item.productId?._id || item.productId,
          remarks: item.remarks || "",
          qty: item.qty || "",
        })) || [],
      );
    }
  }, [editData]);

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold text-[#FF6900] mb-4">
        {isEditMode ? "Edit Outward Entry" : "New Outward Entry"}
      </h2>

      {/* ================= TOP FORM ================= */}

      <div className="bg-white border rounded px-4 py-3 shadow-sm mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Outward Name
            </label>
            <Input
              name="outwardName"
              placeholder="Enter outward name"
              value={formData.outwardName}
              onChange={handleTopChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Outward Mobile No.
            </label>
            <Input
              name="outwardMobile"
              placeholder="Enter mobile no"
              value={formData.outwardMobile}
              onChange={handleTopChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Outward Date
            </label>
            <Input
              type="date"
              name="outwardDate"
              value={formData.outwardDate}
              onChange={handleTopChange}
              onFocus={(e) => e.target.showPicker()}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Outward No.
            </label>
            <Input
              name="outwardNo"
              placeholder="Enter outward no."
              value={formData.outwardNo}
              onChange={handleTopChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleTopChange}
              className="w-full border rounded px-3 py-2 mt-1 resize-y min-h-10.5"
              placeholder="Enter outward description"
            />
          </div>
        </div>
      </div>

      {/* ================= ITEM DETAILS ================= */}

      <h3 className="text-lg font-semibold text-[#FF6900] mb-3">
        Item Details
      </h3>

      <div className="bg-white border-b rounded shadow-sm flex flex-col">
        <div className="bg-[#F3F4F6] px-4 py-3 border-t rounded">
          <div className="grid grid-cols-[60px_2fr_2fr_1fr] gap-3 text-sm font-semibold text-gray-600">
            <div>Action</div>
            <div>Product</div>
            <div>Remarks</div>
            <div>Qty</div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-3">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-[60px_2fr_2fr_1fr] gap-3 mb-3 items-center"
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
                  { key: "stock", label: "Available stock" },
                  { key: "uom", label: "UOM" },
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
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 bg-[#FF6900] text-white px-4 py-2 rounded hover:opacity-90 cursor-pointer"
      >
        Add New Row
      </button>

      {/* ================= FOOTER ================= */}

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>

        <Button variant="inwardform" onClick={handleSave}>
          {isEditMode ? "Update" : "Save"}
        </Button>
      </div>
      <StatusModal
        isOpen={modal.open}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </div>
  );
}

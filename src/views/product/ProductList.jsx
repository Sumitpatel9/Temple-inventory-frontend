import { useState, useEffect, useCallback } from "react";

// Table Components
import Table from "../../conponents/table/Table";
import TableHeader from "../../conponents/table/TableHeader";
import TableRow from "../../conponents/table/TableRow";
import TableActions from "../../conponents/table/TableActions";
import TableBody from "../../conponents/table/TableBody";

// UI Components
import StatusBadge from "../../conponents/ui/StatusBadge";

// Filter Components
import ListHeaderActions from "../../conponents/filters/ListHeaderActions";

import axios from "../../services/axiosInstance";
import { Api } from "../../services/api";
import StatusModal from "../../conponents/ui/StatusModal";
import DateDisplay from "../../conponents/ui/DateDisplay";
import DynamicFormModal from "../../conponents/forms/DynamicFormModal";
import { exportToExcel } from "../../utils/exportExcel";
import useTableFilters from "../../hooks/useTableFilters";

const ProductList = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All Categories", value: "" },
  ]);
  const [statusPopup, setStatusPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // LOGIC: State for backend req.body (Search, Filters, and Sort)
  const { filters, handleFilterChange, handleSort } = useTableFilters({
    search: "",
    category: "",
    status: "Active",
    productName: "",
    warehouseReck: "",
    sortField: "createdAt",
    sortOrder: "desc",
    startInwardDate: "",
    endInwardDate: "",
    startOutwardDate: "",
    endOutwardDate: "",
  });

  const initialFormState = {
    category: "",
    productName: "",
    uom: "",
    minQty: "",
    warehouseReck: "",
    status: "Active",
  };

  const uomOptions = [
    "Select UOM",
    "berrual",
    "box",
    "cm",
    "dz",
    "ft",
    "gm",
    "in",
    "kg",
    "km",
    "ltr",
    "mg",
    "ml",
    "nos",
    "psc",
  ];

  const productFields = [
    {
      row: true,
      fields: [
        {
          name: "category",
          label: "Category",
          placeholder: "Category",
          required: true,
        },
        {
          name: "productName",
          label: "Product Name",
          placeholder: "Enter product name",
          required: true,
        },
      ],
    },
    {
      row: true,
      fields: [
        {
          name: "uom",
          label: "UOM",
          type: "select",
          options: uomOptions,
          required: true,
        },
        { 
          name: "minQty",
          label: "Min QTY",
          type: "number",
          placeholder: "Enter minimum QTY",
          required: true,
        },
      ],
    },
    {
      row: true,
      fields: [
        {
          name: "warehouseReck",
          label: "Warehouse Reck",
          placeholder: "Enter warehouse reck",
          required: true,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Active", value: "Active" },
            { label: "Deactive", value: "Deactive" },
          ],
        },
      ],
    },
  ];

  const [formData, setFormData] = useState(initialFormState);

  // LOGIC: Fetch function sending filters in POST body
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        Api.productList,
        filters, // Unified state sent to backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        Api.productCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // API mathi ["Essentials", "FP"] avse, ene format kari ne set kariye
      const formatted = res.data.map((cat) => ({
        label: cat,
        value: cat,
      }));

      setCategoryOptions([
        { label: "All Categories", value: "" },
        ...formatted,
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= SAVE (CREATE + UPDATE) =================
  const handleSave = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "category",
      "productName",
      "uom",
      "minQty",
      "warehouseReck",
    ];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let successMessage = "";

      if (editId) {
        await axios.post(
          Api.productUpdate,
          { id: editId, ...formData },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        successMessage = "Product Updated successfully";
      } else {
        await axios.post(Api.productCreate, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        successMessage = "Product Created successfully";
      }

      setStatusPopup({
        show: true,
        message: successMessage,
        type: "success",
      });

      fetchProducts();
      fetchCategories();
      setFormData(initialFormState);
      setErrors({});
      setEditId(null);
      setOpen(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      setStatusPopup({
        show: true,
        message: errorMsg,
        type: "error",
      });
      console.error("Save error:", error);
    }
  };

  // ================= EDIT =================
  const handleUpdate = (product) => {
    setFormData({
      category: product.category || "",
      productName: product.productName || "",
      uom: product.uom || "",
      minQty: product.minQty || "",
      warehouseReck: product.warehouseReck || "",
      status: product.status || "Active",
    });
    setEditId(product._id);
    setOpen(true);
  };

  const handleExport = () => {
    const columns = [
      { label: "SR", key: "sr" },
      { label: "Status", key: "status" },
      { label: "Product Name", key: "productName" },
      { label: "Category", key: "category" },
      { label: "Min Quantity", key: "minQty" },
      { label: "Current Stock", key: "currentStock" },
      { label: "UOM", key: "uom" },
      { label: "Warehouse Reck", key: "warehouseReck" },
      { label: "Temple Name", key: "templeName" },
      { label: "Last Inward", key: "lastInwardDate" },
      { label: "Last Outward", key: "lastOutwardDate" },
    ];

    const fileName = `Product_List_${new Date().toISOString().split("T")[0]}`;

    exportToExcel(products, columns, fileName);
  };

  return (
    <div className="h-full flex flex-col">
      {/* ================= HEADER ================= */}
      <ListHeaderActions
        onAdd={() => {
          setEditId(null);
          setFormData(initialFormState);
          setOpen(true);
        }}
        showAddButton={true}
        showExportButton={true}
        onExport={handleExport}
        fields={[
          {
            type: "search",
            className: "w-40",
            props: {
              name: "search",
              value: filters.search,
              onChange: handleFilterChange,
            },
          },
          {
            type: "select",
            className: "w-40",
            options: categoryOptions,
            props: {
              name: "category",
              value: filters.category,
              onChange: handleFilterChange,
            },
          },
          {
            type: "date",
            className: "w-40",
            placeholder: "START INWARD DATE",
            props: {
              name: "startInwardDate",
              value: filters.startInwardDate,
              onChange: handleFilterChange,
            },
          },
          {
            type: "date",
            className: "w-40",
            placeholder: "END INWARD DATE",
            props: {
              name: "endInwardDate",
              value: filters.endInwardDate,
              onChange: handleFilterChange,
            },
          },
          {
            type: "date",
            className: "w-40",
            placeholder: "START OUTWARD DATE",
            props: {
              name: "startOutwardDate",
              value: filters.startOutwardDate,
              onChange: handleFilterChange,
            },
          },
          {
            type: "date",
            className: "w-40",
            placeholder: "END OUTWARD DATE",
            props: {
              name: "endOutwardDate",
              value: filters.endOutwardDate,
              onChange: handleFilterChange,
            },
          },
        ]}
      />

      {/* ================= TABLE ================= */}
      <Table>
        <TableHeader
          onSort={handleSort}
          onSearch={handleFilterChange}
          filters={filters}
          columns={[
            { label: "SR.", key: "sr", search: false, sort: false },
            { label: "Actions", key: "actions", search: false, sort: false },
            { label: "Status", key: "status", search: false, sort: false },
            { label: "Product Name", key: "productName" },
            { label: "Categories", key: "category" },
            { label: "Min Quantity", key: "minQty" },
            { label: "Current Stock", key: "currentStock" },
            { label: "Warehouse reck", key: "warehouseReck" },
            { label: "Temple name", key: "templeName" },
            {
              label: "Last Inward",
              key: "lastInwardDate",
              search: false,
            },
            {
              label: "Last Outward",
              key: "lastOutwardDate",
              search: false,
            },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="11" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center py-6">
                No Data Found
              </td>
            </tr>
          ) : (
            products.map((u, i) => (
              <TableRow key={u._id || i}>
                {/* <TableRow
              key={u._id || i}
              className={u.currentStock < u.minQty ? "bg-red-50" : ""} > */}
                <td
                  className="px-4 py-3 text-gray-600 font-medium whitespace-nowrap"
                  style={{ width: "10px" }}
                >
                  {i + 1}
                </td>

                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ width: "10px" }}
                >
                  <TableActions
                    showDelete={false}
                    showEdit={true}
                    row={u}
                    onEdit={handleUpdate}
                  />
                </td>

                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ width: "10px" }}
                >
                  <StatusBadge status={u.status} />
                </td>

                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "180px" }}
                >
                  {u.productName}
                </td>

                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "120px" }}
                >
                  {u.category}
                </td>

                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "100px" }}
                >
                  {u.minQty} <span className="lowercase">{u.uom}</span>
                </td>

                <td
                  className="px-4 py-3 text-sm text-gray-600 font-semibold whitespace-nowrap"
                  style={{ minWidth: "120px" }}
                >
                  {/* {u.currentStock} <span className="lowercase">{u.uom}</span> */}
                  {u.currentStock < u.minQty ? (
                    <span className="text-red-600 font-bold">
                      {u.currentStock} {u.uom} ⚠ Low
                    </span>
                  ) : (
                    <span>
                      {u.currentStock} {u.uom}
                    </span>
                  )}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "140px" }}
                >
                  {u.warehouseReck}
                </td>

                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "120px" }}
                >
                  {u.templeName || "—"}
                </td>

                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "120px" }}
                >
                  <DateDisplay date={u.lastInwardDate} />
                </td>

                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "120px" }}
                >
                  <DateDisplay date={u.lastOutwardDate} />
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <StatusModal
        isOpen={statusPopup.show}
        message={statusPopup.message}
        type={statusPopup.type}
        onClose={() => setStatusPopup({ ...statusPopup, show: false })}
      />

      {/* ================= MODAL ================= */}

      <DynamicFormModal
        open={open}
        title={editId ? "Edit Product" : "Add Product"}
        fields={productFields}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSave}
        onCancel={() => {
          setOpen(false);
          setEditId(null);
          setFormData(initialFormState);
          setErrors({});
        }}
        submitText={editId ? "Update" : "Save"}
      />
    </div>
  );
};

export default ProductList;

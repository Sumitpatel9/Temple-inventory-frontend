import { useState, useEffect, useCallback } from "react";
import axios from "../../services/axiosInstance";

import Table from "../../conponents/table/Table";
import TableHeader from "../../conponents/table/TableHeader";
import TableRow from "../../conponents/table/TableRow";
import TableActions from "../../conponents/table/TableActions";
import TableBody from "../../conponents/table/TableBody";

import StatusBadge from "../../conponents/ui/StatusBadge";

import ListHeaderActions from "../../conponents/filters/ListHeaderActions";
import { Api } from "../../services/api";
import StatusModal from "../../conponents/ui/StatusModal";
import DynamicFormModal from "../../conponents/forms/DynamicFormModal";
import { exportToExcel } from "../../utils/exportExcel";
import useTableFilters from "../../hooks/useTableFilters";

const TempleList = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [temples, setTemples] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  // LOGIC: Combined state for backend POST body (Filtering & Sorting)

  const { filters, handleFilterChange, handleSort } = useTableFilters({
    search: "",
    status: "",
    templeName: "",
    templeCode: "",
    address: "",
    sortField: "createdAt",
    sortOrder: "desc",
  });

  const initialFormState = {
    templeName: "",
    templeCode: "",
    address: "",
    status: "Active",
  };
  const [statusPopup, setStatusPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const templeFields = [
    {
      name: "templeName",
      label: "Temple Name",
      placeholder: "Enter temple name",
      required: true,
    },
    {
      name: "templeCode",
      label: "Short Code",
      placeholder: "Enter short code",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Enter address",
    },
  ];

  const [formData, setFormData] = useState(initialFormState);

  // LOGIC: Updated fetch sending filters object in req.body
  const fetchTemples = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        Api.templelist,
        filters, // Unified state sent to backend
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTemples(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  // ================= SAVE (CREATE + UPDATE) =================
  const handleSave = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!formData.templeName.trim()) {
      validationErrors.templeName = "Temple Name is required";
    }
    if (!formData.templeCode.trim()) {
      validationErrors.templeCode = "Short Code is required";
    }

    // 2. Stop if there are errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let successMessage = "";

      if (editId) {
        await axios.post(
          Api.templeupdate,
          {
            id: editId,
            ...formData,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        successMessage = "Temple Updated successfully";
      } else {
        await axios.post(Api.templeadd, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        successMessage = "Temple Created successfully";
      }

      setStatusPopup({
        show: true,
        message: successMessage,
        type: "success",
      });

      fetchTemples();

      // reset
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
  const handleEdit = (temple) => {
    setFormData({
      templeName: temple.templeName || "",
      templeCode: temple.templeCode || "",
      address: temple.address || "",
      status: temple.status || "Active",
    });

    setEditId(temple._id);
    setOpen(true);
  };

  const handleExport = () => {
    const columns = [
      { label: "SR", key: "sr" },
      { label: "Status", key: "status" },
      { label: "Temple Name", key: "templeName" },
      { label: "Short Code", key: "templeCode" },
      { label: "Address", key: "address" },
    ];

    const fileName = `Temple_List_${new Date().toISOString().split("T")[0]}`;

    exportToExcel(temples, columns, fileName);
  };

  return (
    <div className="h-full flex flex-col">
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
            props: {
              name: "search",
              value: filters.search,
              onChange: handleFilterChange,
            },
          },
          {
            type: "status",
            props: {
              name: "status",
              value: filters.status,
              onChange: handleFilterChange,
            },
          },
        ]}
      />

      <Table>
        <TableHeader
          onSort={handleSort}
          onSearch={handleFilterChange}
          filters={filters}
          columns={[
            { label: "SR.", key: "sr", search: false, sort: false },
            { label: "Actions", key: "actions", search: false, sort: false },
            { label: "Status", key: "status", search: false, sort: false },
            { label: "Temple Name", key: "templeName" },
            { label: "Short Code", key: "templeCode" },
            { label: "Address", key: "address" },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : temples.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6">
                No Data Found
              </td>
            </tr>
          ) : (
            temples.map((u, i) => (
              <TableRow key={u._id}>
                <td
                  className="px-4 py-3"
                  style={{ minWidth: "10px", width: "10px" }}
                >
                  {i + 1}
                </td>

                <td
                  className="px-4 py-3"
                  style={{ minWidth: "10px", width: "10px" }}
                >
                  <TableActions
                    showDelete={false}
                    showEdit={true}
                    row={u}
                    onEdit={handleEdit}
                  />
                </td>

                <td
                  className="px-4 py-3"
                  style={{ minWidth: "10px", width: "10px" }}
                >
                  <StatusBadge status={u.status} />
                </td>

                <td className="px-4 py-3">{u.templeName}</td>
                <td className="px-4 py-3">{u.templeCode}</td>
                <td className="px-4 py-3">{u.address}</td>
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
        title={editId ? "Edit Temple" : "Add Temple"}
        fields={templeFields}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSave}
        onCancel={() => {
          setOpen(false);
          setEditId(null);
          setFormData(initialFormState);
        }}
        submitText={editId ? "Update" : "Save"}
      />
    </div>
  );
};

export default TempleList;

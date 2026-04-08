import { useState, useEffect } from "react";
import axios from "../../services/axiosInstance";
import { Api } from "../../services/api";

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
import { Eye, EyeOff } from "lucide-react";
import StatusModal from "../../conponents/ui/StatusModal";
import DateDisplay from "../../conponents/ui/DateDisplay";
import DynamicFormModal from "../../conponents/forms/DynamicFormModal";
import { exportToExcel } from "../../utils/exportExcel";
import useTableFilters from "../../hooks/useTableFilters";

const UserList = () => {
  const [open, setOpen] = useState(false);
  const [templeOptions, setTempleOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);
  const [errors, setErrors] = useState({});
  const [statusPopup, setStatusPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { filters, handleFilterChange, handleSort } = useTableFilters({
    search: "",
    role: "",
    status: "Active",
    userName: "",
    loginId: "",
    mobile: "",
    sortField: "createdAt",
    sortOrder: "desc",
    startLoginDate: "",
    endLoginDate: "",
  });

  const initialFormState = {
    userId: "",
    templeId: "",
    role: "User",
    userName: "",
    mobile: "",
    loginId: "",
    password: "",
    status: "Active",
  };

  const userFields = [
    {
      row: true,
      fields: [
        {
          name: "templeId",
          label: "Temple name",
          type: "commonSelect",
          required: true,
          options: templeOptions,
          placeholder: "Select temple",
        },
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            { label: "Admin", value: "Admin" },
            { label: "User", value: "User" },
          ],
        },
      ],
    },

    {
      row: true,
      fields: [
        {
          name: "userName",
          label: "User Name",
          placeholder: "User name",
          required: true,
        },
        {
          name: "mobile",
          label: "Mobile",
          placeholder: "Enter mobile",
          required: true,
        },
      ],
    },

    {
      row: true,
      fields: [
        {
          name: "loginId",
          label: "Login ID",
          placeholder: "Login ID",
          required: true,
        },
        {
          name: "password",
          label: "Password",
          placeholder: "Enter password",
          required: true,
        },
      ],
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
  ];

  const [formData, setFormData] = useState(initialFormState);

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.templeId) tempErrors.templeId = "Temple is required";
    if (!formData.userName) tempErrors.userName = "User name is required";
    if (!formData.mobile) {
      tempErrors.mobile = "Mobile is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = "Enter a valid 10-digit number";
    }
    if (!formData.loginId) {
      tempErrors.loginId = "Login ID is required";
    } else if (/\s/.test(formData.loginId)) {
      tempErrors.loginId = "Login ID cannot contain spaces";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password should be at least 6 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // returns true if no errors
  };

  // LOGIC: Updated fetch sending filters object in req.body
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(Api.listUsers, filters, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userArray = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setUsers(userArray);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemples = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        Api.templelist,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const templeArray = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];
      const formatted = templeArray.map((t) => ({
        value: t._id,
        label: t.templeName,
      }));
      setTempleOptions(formatted);
    } catch (error) {
      console.error("Error fetching temples:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  useEffect(() => {
    fetchTemples();
  }, []);

  const handleOpenAdd = () => {
    setErrors({});
    setFormData({ ...initialFormState, userId: "USR-" + Date.now() });
    setIsEditing(false);
    setOpen(true);
  };

  const handleOpenEdit = (user) => {
    setFormData({
      _id: user._id,
      templeId: user.templeId,
      role: user.role,
      userName: user.userName,
      mobile: user.mobile,
      loginId: user.loginId,
      password: user.password,
      status: user.status,
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem("token");

      // Define the payload based on whether we are editing or creating
      if (isEditing) {
        const payload = {
          id: formData._id,
          templeId: formData.templeId,
          role: formData.role,
          userName: formData.userName,
          mobile: formData.mobile,
          loginId: formData.loginId,
          password: formData.password,
          status: formData.status,
        };

        await axios.post(Api.updateUser, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set Success Popup for Update
        setStatusPopup({
          show: true,
          message: "Record Updated successfully",
          type: "success",
        });
      } else {
        const payload = { ...formData };

        await axios.post(Api.createUser, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set Success Popup for Create
        setStatusPopup({
          show: true,
          message: "Record Created successfully",
          type: "success",
        });
      }

      // Refresh list and close the entry form modal
      fetchUsers();
      setOpen(false);
    } catch (error) {
      // Handle Error Popup
      // This pulls the specific error message from your backend if available
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      setStatusPopup({
        show: true,
        message: errorMessage,
        type: "error",
      });

      console.error("Save Error:", error.response?.data || error.message);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    const columns = [
      { label: "SR", key: "sr" },
      { label: "Status", key: "status" },
      { label: "User Name", key: "userName" },
      { label: "Role", key: "role" },
      { label: "Login ID", key: "loginId" },
      { label: "Password", key: "password" },
      { label: "Mobile", key: "mobile" },
      { label: "Last Login", key: "lastLogin" },
    ];

    const fileName = `User_List_${new Date().toISOString().split("T")[0]}`;

    exportToExcel(users, columns, fileName);
  };

  return (
    <div className="h-full flex flex-col">
      <ListHeaderActions
        onAdd={handleOpenAdd}
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
            type: "date",
            placeholder: "START LOGIN DATE",
            props: {
              name: "startLoginDate",
              value: filters.startLoginDate,
              onChange: handleFilterChange,
            },
          },
          {
            type: "date",
            placeholder: "END LOGIN DATE",
            props: {
              name: "endLoginDate",
              value: filters.endLoginDate,
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
            { label: "User Name", key: "userName" },
            { label: "Role", key: "role" },
            { label: "Login ID", key: "loginId" },
            { label: "Password", key: "password", search: false, sort: false },
            { label: "Mobile", key: "mobile" },
            { label: "Last Login", key: "lastLogin", search: false },
            {
              label: "Temple Name",
              key: "templeName",
            },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center py-6">
                No Data Found
              </td>
            </tr>
          ) : (
            users.map((u, i) => (
              <TableRow key={u._id || i}>
                <td
                  className="px-4 py-3 text-gray-600 font-medium whitespace-nowrap w-5"
                  style={{ minWidth: "10px", width: "10px" }}
                >
                  {i + 1}
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ minWidth: "10px", width: "10px" }}
                >
                  <TableActions
                    showDelete={false}
                    showEdit={true}
                    onEdit={() => handleOpenEdit(u)}
                  />
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap"
                  style={{ minWidth: "10px", width: "10px" }}
                >
                  <StatusBadge status={u.status} />
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "180px" }}
                >
                  {u.userName}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "100px" }}
                >
                  {u.role}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "150px" }}
                >
                  {u.loginId}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap flex justify-between items-center gap-2"
                  style={{ minWidth: "120px" }}
                >
                  {visiblePasswordId === u._id ? u.password : "••••••"}
                  <button
                    type="button"
                    onClick={() =>
                      setVisiblePasswordId(
                        visiblePasswordId === u._id ? null : u._id,
                      )
                    }
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {visiblePasswordId === u._id ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "120px" }}
                >
                  {u.mobile}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "150px" }}
                >
                  <DateDisplay date={u.lastLogin} />
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap"
                  style={{ minWidth: "150px" }}
                >
                  {templeOptions.find((t) => t.value === u.templeId)?.label ||
                    "—"}
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

      <DynamicFormModal
        open={open}
        title={isEditing ? "Update User" : "Add New User"}
        fields={userFields}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSave}
        onCancel={() => setOpen(false)}
        submitText={isEditing ? "Update" : "Save"}
      />
    </div>
  );
};

export default UserList;

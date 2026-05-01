import { useState, useEffect, useCallback } from "react";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileCard from "../../components/MobileCard";
import MobileStatusBadge from "../../components/MobileStatusBadge";
import MobileStatusModal from "../../components/MobileStatusModal";
import MobileFilterBar from "../../components/MobileFilterBar";
import MobileSortModal from "../../components/MobileSortModal";
import MobileCardField from "../../components/MobileCardField";
import { Pencil, Eye, EyeOff, Building2, AtSign, Phone, Lock, Clock } from "lucide-react";

const SORT_FIELDS = [
  { label: "User Name", value: "userName" },
  { label: "Login ID", value: "loginId" },
  { label: "Mobile", value: "mobile" },
  { label: "Role", value: "role" },
  { label: "Last Login", value: "lastLogin" },
  { label: "Created Time", value: "createdAt" },
];

const initialForm = { templeId: "", role: "User", userName: "", mobile: "", loginId: "", password: "", status: "Active" };

export default function MobileUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSort, setShowSort] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [templeOptions, setTempleOptions] = useState([]);
  const [visiblePwdId, setVisiblePwdId] = useState(null);
  const [modal, setModal] = useState({ show: false, message: "", type: "success" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        Api.listUsers,
        { search, status: statusFilter, sortField, sortOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, statusFilter, sortField, sortOrder]);

  const fetchTemples = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(Api.templelist, {}, { headers: { Authorization: `Bearer ${token}` } });
      const arr = Array.isArray(res.data) ? res.data : res.data.data || [];
      setTempleOptions(arr.map((t) => ({ value: t._id, label: t.templeName })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchTemples(); }, []);

  const validate = () => {
    const errs = {};
    if (!formData.templeId) errs.templeId = "Temple is required";
    if (!formData.userName) errs.userName = "User name is required";
    if (!formData.mobile) {
      errs.mobile = "Mobile is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errs.mobile = "Enter a valid 10-digit number";
    }
    if (!formData.loginId) {
      errs.loginId = "Login ID is required";
    } else if (/\s/.test(formData.loginId)) {
      errs.loginId = "Login ID cannot contain spaces";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password should be at least 6 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.post(Api.updateUser, { id: formData._id, ...formData }, { headers: { Authorization: `Bearer ${token}` } });
        setModal({ show: true, message: "Record Updated successfully", type: "success" });
      } else {
        await axios.post(Api.createUser, formData, { headers: { Authorization: `Bearer ${token}` } });
        setModal({ show: true, message: "Record Created successfully", type: "success" });
      }
      setShowForm(false); setFormData(initialForm); fetchUsers();
    } catch (err) {
      setModal({ show: true, message: err.response?.data?.message || "Something went wrong", type: "error" });
    }
  };

  const openEdit = (u) => {
    setFormData({ _id: u._id, templeId: u.templeId, role: u.role, userName: u.userName, mobile: u.mobile, loginId: u.loginId, password: u.password, status: u.status });
    setIsEditing(true); setShowForm(true);
  };

  const getTempleName = (id) => templeOptions.find((t) => t.value === id)?.label || "—";

  return (
    <div className="p-4 space-y-3">
      <MobileStatusModal isOpen={modal.show} message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, show: false })} />

      <MobileFilterBar
        search={search} onSearchChange={(e) => setSearch(e.target.value)}
        status={statusFilter} onStatusChange={setStatusFilter}
        onAdd={() => { setFormData({ ...initialForm, userId: "USR-" + Date.now() }); setIsEditing(false); setErrors({}); setShowForm(true); }}
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
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No Data Found</div>
      ) : (
        users.map((u) => (
          <MobileCard key={u._id} accent={u.status === "Active" ? "green" : "red"}>
            {/* Header */}
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{u.userName}</p>
                <MobileStatusBadge status={u.status} />
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md font-medium shrink-0">{u.role}</span>
              </div>
              <button onClick={() => openEdit(u)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 ml-2 shrink-0">
                <Pencil size={13} className="text-gray-500" />
              </button>
            </div>

            {/* All fields */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <MobileCardField icon={<Building2 size={12} />} value={getTempleName(u.templeId)} />
              <MobileCardField icon={<AtSign size={12} />} value={u.loginId} />
              <MobileCardField icon={<Phone size={12} />} value={u.mobile} />
              {/* Password with toggle */}
              <div className="flex gap-1.5 text-xs items-center">
                <span className="text-gray-400 shrink-0"><Lock size={12} /></span>
                <span className="text-gray-700 font-medium">
                  {visiblePwdId === u._id ? u.password : "••••••"}
                </span>
                <button onClick={() => setVisiblePwdId(visiblePwdId === u._id ? null : u._id)} className="ml-0.5 text-gray-400">
                  {visiblePwdId === u._id ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              {u.lastLogin && <MobileCardField icon={<Clock size={12} />} value={new Date(u.lastLogin).toLocaleDateString()} />}
            </div>
          </MobileCard>
        ))
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-semibold text-gray-800 mb-4">{isEditing ? "Edit User" : "Add User"}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Temple *</label>
                <select value={formData.templeId} onChange={(e) => setFormData({ ...formData, templeId: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                  <option value="">Select temple</option>
                  {templeOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {errors.templeId && <p className="text-red-500 text-xs mt-1">{errors.templeId}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              {[
                { name: "userName", label: "User Name *", placeholder: "User name" },
                { name: "mobile", label: "Mobile *", placeholder: "10-digit mobile" },
                { name: "loginId", label: "Login ID *", placeholder: "Login ID" },
                { name: "password", label: "Password *", placeholder: "Min 6 characters" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
                  <input value={formData[f.name] || ""} onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                  {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold text-sm">Cancel</button>
                <button type="submit"
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm">{isEditing ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

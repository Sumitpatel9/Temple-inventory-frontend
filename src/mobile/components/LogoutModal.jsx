import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosInstance";
import { Api } from "../../services/api";

export default function LogoutModal({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(Api.userlogout, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {}
    finally {
      localStorage.clear();
      navigate("/m");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Log out</h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-3 rounded-lg bg-orange-500 text-white font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

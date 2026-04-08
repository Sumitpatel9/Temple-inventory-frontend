import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../../services/api";
import axios from "../../services/axiosInstance";

export default function LogoutPage({ onClose }) {
  const navigate = useNavigate();

  // ✅ Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        Api.userlogout,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log("Logout API Error:", error);
    } finally {
      // Always clear storage and redirect
      localStorage.clear();
      navigate("/");
    }
  };

  // ✅ Click Outside Close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="
        fixed inset-0
        bg-black/50 backdrop-blur-sm
        flex items-center justify-center
        z-[9999]
        animate-fadeIn
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          shadow-2xl
          p-8
          max-w-md
          w-full
          mx-4
          transform transition-all
          animate-scaleIn
        "
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Log out
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-8">
          Are you sure you want to logout from this App?
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="
              flex-1
              px-6 py-3
              rounded-lg
              border border-gray-300
              text-gray-600
              font-semibold
              hover:bg-gray-50
              active:scale-[0.98]
              transition
              active:scale-95
              cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="
              flex-1
              px-6 py-3
              rounded-lg
              bg-orange-500
              text-white
              font-semibold
              hover:bg-orange-600
              active:scale-[0.98]
              transition
              active:scale-95
              cursor-pointer
            "
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

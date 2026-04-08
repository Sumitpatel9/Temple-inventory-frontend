import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MobileStatusModal from "../../components/MobileStatusModal";

export default function MobileDashboard() {
  const location = useLocation();
  const [modal, setModal] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (location.state?.loginSuccess) {
      setModal({ show: true, message: "Login Successful", type: "success" });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  return (
    <div className="p-4">
      <MobileStatusModal
        isOpen={modal.show}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, show: false })}
      />
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🏛️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Welcome, {currentUser?.userName || "User"}
        </h2>
        <p className="text-sm text-gray-500">{currentUser?.role || ""}</p>
      </div>
    </div>
  );
}

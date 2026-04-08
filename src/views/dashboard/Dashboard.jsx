import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StatusModal from "../../conponents/ui/StatusModal";

const Dashboard = () => {
  const location = useLocation();
  const [statusPopup, setStatusPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    // Check if user just logged in
    if (location.state?.loginSuccess) {
      setStatusPopup({
        show: true,
        message: "Login Successful", // Matches your "Record Updated Successfully" style
        type: "success",
      });

      // Clear the state so the popup doesn't reappear if the user refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
      <StatusModal
        isOpen={statusPopup.show}
        message={statusPopup.message}
        type={statusPopup.type}
        onClose={() => setStatusPopup({ ...statusPopup, show: false })}
      />

      <h1 className="text-2xl font-semibold text-gray-800">Dashboard Page</h1>
    </div>
  );
};

export default Dashboard;

import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import LogoutPage from "../views/auth/LogoutPage";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const [showLogoutPage, setShowLogoutPage] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-[#EDEFF4] via-white to-[#EDEFF4]">
      <Header toggleSidebar={() => setOpen(!open)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={open} onLogoutClick={() => setShowLogoutPage(true)} />

        {showLogoutPage && (
          <LogoutPage onClose={() => setShowLogoutPage(false)} />
        )}

        <main className="flex-1 p-6 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

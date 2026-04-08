import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Package,
  Layers,
  Menu,
  X,
  Boxes,
  Users,
  TrendingUp,
  CalendarDays,
  TrendingDown,
  AlertTriangle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import LogoutModal from "../components/LogoutModal";

const bottomNav = [
  { name: "Dashboard", path: "/dashboard-m", icon: LayoutDashboard },
  { name: "Inward", path: "/inward-m", icon: ArrowDownCircle },
  { name: "Stock", path: "/stock-m", icon: Package },
  { name: "Outward", path: "/outward-m", icon: ArrowUpCircle },
  { name: "Menu", path: null, icon: Menu, isMenu: true },
];

const drawerMenu = [
  { name: "Fast Moving Products", path: "/stock/fast-moving-m", icon: TrendingUp },
  { name: "Day Stock Report", path: "/stock/day-report-m", icon: CalendarDays },
  { name: "Slow Moving Report", path: "/stock/slow-moving-m", icon: TrendingDown },
  { name: "Low Stock Alert", path: "/stock/low-alert-m", icon: AlertTriangle },
  { name: "Temple", path: "/temple-m", icon: Boxes, adminOnly: true },
  { name: "Users", path: "/user-m", icon: Users, adminOnly: true },
  { name: "Products", path: "/product-m", icon: Package, adminOnly: true },
];

export default function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userRole = currentUser?.role;
  const userName = currentUser?.userName || "User";

  const pageTitle = (() => {
    const path = location.pathname;
    if (path === "/dashboard-m") return "Dashboard";
    if (path === "/inward-m") return "Inward";
    if (path === "/inward-detail-m") return "Inward Entry";
    if (path === "/outward-m") return "Outward";
    if (path === "/outward-detail-m") return "Outward Entry";
    if (path === "/stock-m") return "Stock";
    if (path.startsWith("/stock/fast-moving-m")) return "Fast Moving Products";
    if (path.startsWith("/stock/day-report-m")) return "Day Stock Report";
    if (path.startsWith("/stock/slow-moving-m")) return "Slow Moving Report";
    if (path.startsWith("/stock/low-alert-m")) return "Low Stock Alert";
    if (path.startsWith("/stock-m/")) return "Stock Detail";
    if (path === "/temple-m") return "Temple";
    if (path === "/user-m") return "Users";
    if (path === "/product-m") return "Products";
    return "App";
  })();

  const filteredDrawer = drawerMenu.filter(
    (item) => !item.adminOnly || userRole === "Admin"
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between shrink-0">
        <span className="text-lg font-semibold text-gray-800">{pageTitle}</span>
        <span className="text-sm text-gray-500">{userName}</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-40">
        {bottomNav.map((item) => {
          const isActive = item.path && location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.isMenu) setDrawerOpen(true);
                else navigate(item.path);
              }}
              className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition ${
                isActive ? "text-orange-500" : "text-gray-500"
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <span className="font-semibold text-gray-800">Menus</span>
              <button onClick={() => setDrawerOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {filteredDrawer.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-gray-700"
                >
                  <item.icon size={18} className="text-orange-500" />
                  <span className="flex-1 text-left text-sm">{item.name}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
            <div className="border-t p-4">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setShowLogout(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}
    </div>
  );
}

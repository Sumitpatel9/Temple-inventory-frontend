import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { menuItems } from "./menuItems";
import { ChevronDown, Circle } from "lucide-react";
import axios from "../services/axiosInstance";
import { Api } from "../services/api";

export default function Sidebar({ open, onLogoutClick }) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [version, setVersion] = useState("");

  useEffect(() => {
    fetchVersion();
  }, []);

  const fetchVersion = async () => {
    try {
      const res = await axios.post(Api.version);

      setVersion(res.data.version);
    } catch (error) {
      console.error("Error fetching version:", error);
    }
  };

  // ✅ Get user role
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userRole = currentUser?.role;

  // ✅ Filter menu based on role
  const filteredMenu = menuItems.filter((item) => {
    if (!item.roles) return true; // No role restriction
    return item.roles.includes(userRole);
  });

  // Toggle expandable parent menus (Stock, Master etc.)
  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <aside
      className={`
        flex flex-col
        transition-all duration-300 ease-in-out
        bg-gradient-to-r from-[#EDEFF4] to-white
        border-r border-gray-200
        shadow-sm
        overflow-hidden
        ${open ? "w-55" : "w-16"}
      `}
    >
      <nav className="mt-2 px-2 flex-1">
        {filteredMenu.map((item) => {
          // Logout Menu Item
          if (item.isLogout) {
            return (
              <button
                key={item.name}
                onClick={onLogoutClick}
                className="
                  flex items-center h-12 rounded
                  transition-all duration-300 gap-3
                  text-gray-700 hover:bg-orange-50 hover:text-orange-600
                  w-full text-left
                "
              >
                <div className="w-12 flex justify-center items-center flex-shrink-0">
                  <item.icon size={20} />
                </div>

                <div
                  className={`${
                    open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  <span className="text-sm whitespace-nowrap pr-3">
                    {item.name}
                  </span>
                </div>
              </button>
            );
          }

          // Expandable Parent Menus (Example: Stock, Master)
          if (item.isParent) {
            const expanded = openMenus[item.name];

            return (
              <div key={item.name}>
                {/* Parent Menu Button */}
                <button
                  onClick={() => toggleMenu(item.name)}
                  className="
                    flex items-center h-12 rounded
                    transition-all duration-300 gap-3
                    text-gray-700 hover:bg-gray-100 w-full
                  "
                >
                  <div className="w-12 flex justify-center items-center flex-shrink-0">
                    <item.icon size={20} />
                  </div>

                  {open && (
                    <>
                      <span className="text-sm flex-1 text-left">
                        {item.name}
                      </span>

                      <ChevronDown
                        size={16}
                        className={`transition ${expanded ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>

                {/* Child Menu Items */}
                {expanded && (
                  <div className="mt-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        title={!open ? child.name : ""}
                        className={({
                          isActive,
                        }) => `flex items-center h-11 rounded-lg transition-all duration-200 gap-2 border-l-2
                        ${
                          isActive
                            ? "bg-orange-50 text-orange-600 border-orange-500 font-medium"
                            : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
                        }
                      `}
                      >
                        {/* Child Icon */}
                        <div className="w-12 flex justify-center items-center flex-shrink-0">
                          {child.icon ? (
                            <child.icon size={15} />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                          )}
                        </div>

                        {/* Child Text (Collapsible with Sidebar) */}
                        <div
                          className={`
                            overflow-hidden transition-all duration-300
                            ${open ? "w-auto opacity-100" : "w-0 opacity-0"}
                          `}
                        >
                          <span className="text-sm whitespace-nowrap pr-3">
                            {child.name}
                          </span>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Normal Menu Items (Dashboard, Inward, Outward etc.)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={() => {
                // Check main route active
                const isMainActive = location.pathname === item.path;

                // Check additional mapped routes (Example: inward-detail)
                const isHeaderActive =
                  item.headerRoutes &&
                  item.headerRoutes.some((r) =>
                    location.pathname === r.path,
                  );

                const isActive = isMainActive || isHeaderActive;

                return `
                  flex items-center h-12 rounded
                  transition-all duration-300 gap-3
                  ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `;
              }}
            >
              <div className="w-12 flex justify-center items-center flex-shrink-0">
                <item.icon size={20} title={item.title} />
              </div>

              <div
                className={`${
                  open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                <span
                  className="text-sm whitespace-nowrap pr-3"
                  title={item.title}
                >
                  {item.name}
                </span>
              </div>
            </NavLink>
          );
        })}
      </nav>
      <div
        className={`border-t border-gray-200 py-3 flex justify-center transition-all duration-300 ${open ? "px-4" : ""}`}
      >
        <span className="text-[15px] bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {open ? `Version ${version}` : `v${version}`}
        </span>
      </div>
    </aside>
  );
}

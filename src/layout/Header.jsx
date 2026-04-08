// import { Menu, User } from "lucide-react";
// import { useLocation } from "react-router-dom";
// import { menuItems } from "./menuItems.jsx";

// export default function Header({ toggleSidebar }) {
//   const location = useLocation();
//   const currentPage =
//     menuItems.find((i) => i.path === location.pathname)?.name || "";

//   return (
//     <header className="h-14 bg-gradient-to-r from-[#EDEFF4] via-white to-[#EDEFF4] border-gray-200 shadow-sm flex items-center justify-between px-6">
//       <div className="flex items-center gap-3">
//         <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800 cursor-pointer">
//           <Menu size={22} />
//         </button>

//         <span className="text-lg font-semibold text-gray-800">{currentPage}</span>
//       </div>

//       <div className="flex items-center gap-2 text-sm text-gray-600">
//         <User size={18} />
//         Logged User
//       </div>
//     </header>
//   );
// }

import { Menu, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { menuItems } from "./menuItems.jsx";

export default function Header({ toggleSidebar }) {
  const location = useLocation();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userName = currentUser?.userName || "User";

  const getCurrentPage = () => {
    // MAIN MENU MATCH
    const mainMenu = menuItems.find((item) => item.path === location.pathname);
    if (mainMenu) return mainMenu.name;

    // HEADER ROUTES (LIKE INWARD DETAIL PAGE)
    for (const item of menuItems) {
      if (item.headerRoutes) {
        const match = item.headerRoutes.find((route) =>
          location.pathname.startsWith(route.path),
        );
        if (match) return match.name;
      }
    }

    // CHILD MENU MATCH (MASTER / STOCK)
    for (const item of menuItems) {
      if (item.children) {
        const childMatch = item.children.find((child) =>
          location.pathname.startsWith(child.path),
        );
        if (childMatch) return childMatch.name;
      }
    }

    // FALLBACK
    const parentMatch = menuItems.find((item) =>
      location.pathname.startsWith(item.path),
    );

    return parentMatch?.name || "";
  };

  const currentPage = getCurrentPage();

  return (
    <header className="h-14 bg-gradient-to-r from-[#EDEFF4] via-white to-[#EDEFF4] border-gray-200 shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          <Menu size={22} />
        </button>

        <span className="text-lg font-semibold text-gray-800">
          {currentPage}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mr-15">
        <User size={18} />
        {userName}
      </div>
    </header>
  );
}

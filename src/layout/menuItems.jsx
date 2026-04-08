// import {
//   LayoutDashboard,
//   Boxes,
//   Users,
//   Package,
//   Layers,
//   ArrowDownCircle,
//   ArrowUpCircle,
//   BarChart3,
//   FileDown,
//   FileUp,
//   LogOut,
// } from "lucide-react";

// export const menuItems = [
//   { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
//   { name: "User", path: "/user", icon: Users },
//   { name: "Product", path: "/product", icon: Package },
//   {
//     name: "Inward",
//     path: "/inward",
//     icon: ArrowDownCircle,
//     children: [{ path: "/inward-detail", title: "Add Inward Detail" }],
//   },
//   { name: "Outward", path: "/outward-detail", icon: ArrowUpCircle },
//   { name: "Stock Report", path: "/report/stock", icon: BarChart3 },
//   { name: "Stock", path: "/stock", icon: Layers },
//   { name: "Temple", path: "/temple", icon: Boxes },
//   { name: "Logout", icon: LogOut, isLogout: true },
// ];

import {
  LayoutDashboard,
  Boxes,
  Users,
  Package,
  Layers,
  ArrowDownCircle,
  ArrowUpCircle,
  LogOut,
  Folder,
  TrendingUp,
  CalendarDays,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

export const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
  },

  {
    name: "Inward",
    path: "/inward",
    icon: ArrowDownCircle,
    headerRoutes: [
      { path: "/inward-detail", name: "Inward Details", title: "Inward" },
    ],
  },
  {
    name: "Outward",
    path: "/outward",
    icon: ArrowUpCircle,
    headerRoutes: [
      { path: "/outward-detail", name: "Outward Details", title: "Outward" },
    ],
  },
  {
    name: "Stock",
    path: "/stock",
    icon: Package,
    headerRoutes: [
      { path: "/stock", name: "Stock Details", title: "Stock" },
    ],
  },

  {
    name: "Stock Reports",
    icon: Layers,
    isParent: true,
    title: "Stock Reports",
    children: [
      {
        name: "Fast Moving Products",
        path: "/stock/fast-moving",
        icon: TrendingUp,
        title: "Fast Moving Products",
      },
      {
        name: "Day Stock Report",
        path: "/stock/day-report",
        icon: CalendarDays,
        title: "Day Stock Report",
      },
      {
        name: "Slow Moving Report",
        path: "/stock/slow-moving",
        icon: TrendingDown,
        title: "Slow Moving Products",
      },
      {
        name: "Low Stock Alert",
        path: "/stock/low-alert",
        icon: AlertTriangle,
        title: "Low Stock Alert",
      },
    ],
  },

  {
    name: "Master",
    icon: Folder,
    isParent: true,
    roles: ["Admin"],
    title: "Masters",
    children: [
      { name: "Temple", path: "/temple", icon: Boxes, title: "Temple" },
      { name: "User", path: "/user", icon: Users, title: "User" },
      { name: "Product", path: "/product", icon: Package, title: "Product" },
    ],
  },

  { name: "Logout", icon: LogOut, isLogout: true },
];

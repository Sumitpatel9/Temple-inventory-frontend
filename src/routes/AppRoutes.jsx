import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../views/auth/LoginPage";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../views/dashboard/Dashboard";
import TempleList from "../views/temple/TempleList";
import UserList from "../views/user/UserList";
import ProductList from "../views/product/ProductList";
import InwardMasterList from "../views/inward master/InwardMasterList";
import InwardDetailsList from "../views/inward details/InwardDetailsList";
import OutwardMasterList from "../views/outward master/OutwardMasterList";
import OutwardDetailList from "../views/outward details/OutwardDetailsList";
import DayStockReport from "../views/stock reports/DayStockReport";
import FastMovingProducts from "../views/stock reports/FastMovingProducts";
import SlowMovingReport from "../views/stock reports/SlowMovingReport";
import LowStockAlert from "../views/stock reports/LowStockAlert";
import Stock from "../views/stock/Stock";
import StockDetail from "../views/stock/StockDetail";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/temple" element={<TempleList />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/product" element={<ProductList />} />

        {/* Inward */}
        <Route path="/inward" element={<InwardMasterList />} />
        <Route path="/inward-detail" element={<InwardDetailsList />} />

        {/* Outward */}
        <Route path="/outward" element={<OutwardMasterList />} />
        <Route path="/outward-detail" element={<OutwardDetailList />} />

        {/* Stock */}
        <Route path="/stock" element={<Stock />} />
        <Route path="/stock/:id" element={<StockDetail />} />

        {/* Stock Reports */}
        <Route path="/stock/fast-moving" element={<FastMovingProducts />} />
        <Route path="/stock/day-report" element={<DayStockReport />} />
        <Route path="/stock/slow-moving" element={<SlowMovingReport />} />
        <Route path="/stock/low-alert" element={<LowStockAlert />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

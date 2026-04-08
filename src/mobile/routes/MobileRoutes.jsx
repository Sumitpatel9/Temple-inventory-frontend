import { Routes, Route, Navigate } from "react-router-dom";
import MobileLoginPage from "../pages/auth/MobileLoginPage";
import MobileLayout from "../layout/MobileLayout";
import MobileDashboard from "../pages/dashboard/MobileDashboard";
import MobileTempleList from "../pages/temple/MobileTempleList";
import MobileUserList from "../pages/user/MobileUserList";
import MobileProductList from "../pages/product/MobileProductList";
import MobileInwardMasterList from "../pages/inwardMaster/MobileInwardMasterList";
import MobileInwardDetailsList from "../pages/inwardDetails/MobileInwardDetailsList";
import MobileOutwardMasterList from "../pages/outwardMaster/MobileOutwardMasterList";
import MobileOutwardDetailsList from "../pages/outwardDetails/MobileOutwardDetailsList";
import MobileStock from "../pages/stock/MobileStock";
import MobileStockDetail from "../pages/stock/MobileStockDetail";
import MobileDayStockReport from "../pages/stockReports/MobileDayStockReport";
import MobileFastMovingProducts from "../pages/stockReports/MobileFastMovingProducts";
import MobileSlowMovingReport from "../pages/stockReports/MobileSlowMovingReport";
import MobileLowStockAlert from "../pages/stockReports/MobileLowStockAlert";

export default function MobileRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/m" element={<MobileLoginPage />} />

      {/* Protected with layout */}
      <Route element={<MobileLayout />}>
        <Route path="/dashboard-m" element={<MobileDashboard />} />
        <Route path="/temple-m" element={<MobileTempleList />} />
        <Route path="/user-m" element={<MobileUserList />} />
        <Route path="/product-m" element={<MobileProductList />} />

        {/* Inward */}
        <Route path="/inward-m" element={<MobileInwardMasterList />} />
        <Route path="/inward-detail-m" element={<MobileInwardDetailsList />} />

        {/* Outward */}
        <Route path="/outward-m" element={<MobileOutwardMasterList />} />
        <Route path="/outward-detail-m" element={<MobileOutwardDetailsList />} />

        {/* Stock */}
        <Route path="/stock-m" element={<MobileStock />} />
        <Route path="/stock-m/:id" element={<MobileStockDetail />} />

        {/* Stock Reports */}
        <Route path="/stock/fast-moving-m" element={<MobileFastMovingProducts />} />
        <Route path="/stock/day-report-m" element={<MobileDayStockReport />} />
        <Route path="/stock/slow-moving-m" element={<MobileSlowMovingReport />} />
        <Route path="/stock/low-alert-m" element={<MobileLowStockAlert />} />
      </Route>
    </Routes>
  );
}

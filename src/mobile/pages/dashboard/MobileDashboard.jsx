import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Landmark, FileText, TrendingUp, TrendingDown } from "lucide-react";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileStatusModal from "../../components/MobileStatusModal";

export default function MobileDashboard() {
  const location = useLocation();
  const [modal, setModal] = useState({ show: false, message: "", type: "success" });
  
  const [data, setData] = useState({
    totalTemples: 0,
    totalProducts: 0,
    lowStockCount: 0,
    todayInward: 0,
    todayOutward: 0,
    dailyReportCount: 0,
    fastMovingCount: 0,
    slowMovingCount: 0,
    recentInwards: [],
    recentOutwards: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.loginSuccess) {
      setModal({ show: true, message: "Login Successful", type: "success" });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(Api.dashboardSummary, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  return (
    <div className="p-4 pb-20 space-y-4">
      <MobileStatusModal
        isOpen={modal.show}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, show: false })}
      />

      {/* Welcome Banner */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
          <span className="text-2xl">🏛️</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
            Hi, {currentUser?.userName || "User"}
          </h2>
          <p className="text-xs text-gray-500 capitalize">{currentUser?.role || "Welcome Back!"}</p>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Temples */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
            <Landmark size={20} />
          </div>
          <p className="text-xs font-medium text-gray-500 mb-1">Total Temples</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {loading ? "..." : data.totalTemples}
          </h3>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <Package size={20} />
          </div>
          <p className="text-xs font-medium text-gray-500 mb-1">Total Products</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {loading ? "..." : data.totalProducts}
          </h3>
        </div>

        {/* Today's Inward */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <ArrowDownToLine size={20} />
          </div>
          <p className="text-xs font-medium text-gray-500 mb-1">Today's Inward</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {loading ? "..." : data.todayInward}
          </h3>
        </div>

        {/* Today's Outward */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3">
            <ArrowUpFromLine size={20} />
          </div>
          <p className="text-xs font-medium text-gray-500 mb-1">Today's Outward</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {loading ? "..." : data.todayOutward}
          </h3>
        </div>
      </div>

      {/* Reports & Alerts Links */}
      <div className="space-y-3">
        {/* Low Stock Alerts */}
        <Link to="/m/stock/low-alert" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between active:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Low Stock Alerts</h3>
              <p className="text-xs text-gray-500">Items below minimum quantity</p>
            </div>
          </div>
          <div className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-sm">
            {loading ? "..." : data.lowStockCount}
          </div>
        </Link>

        {/* Day Stock Report */}
        <Link to="/m/stock/day-report" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between active:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Daily Stock Report</h3>
              <p className="text-xs text-gray-500">View today's full report</p>
            </div>
          </div>
          <div className="bg-teal-100 text-teal-600 font-bold px-3 py-1 rounded-full text-sm">
            {loading ? "..." : data.dailyReportCount}
          </div>
        </Link>

        {/* Fast Moving */}
        <Link to="/m/stock/fast-moving" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between active:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-50 text-lime-600 rounded-full flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Fast Moving Products</h3>
              <p className="text-xs text-gray-500">High demand items</p>
            </div>
          </div>
          <div className="bg-lime-100 text-lime-600 font-bold px-3 py-1 rounded-full text-sm">
            {loading ? "..." : data.fastMovingCount}
          </div>
        </Link>

        {/* Slow Moving */}
        <Link to="/m/stock/slow-moving" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between active:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Slow Moving Products</h3>
              <p className="text-xs text-gray-500">Low demand items</p>
            </div>
          </div>
          <div className="bg-yellow-100 text-yellow-600 font-bold px-3 py-1 rounded-full text-sm">
            {loading ? "..." : data.slowMovingCount}
          </div>
        </Link>
      </div>

      {/* Recent Activity Sections */}
      <div className="space-y-4 pt-2">
        {/* Recent Inwards */}
        <div>
          <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="font-bold text-gray-800">Recent Inwards</h3>
            <Link to="/m/inward" className="text-xs text-blue-600 font-medium">View All</Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            ) : data.recentInwards.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No recent inwards</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.recentInwards.map((item, i) => (
                  <div key={i} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.vendorName}</p>
                      <p className="text-xs text-gray-500">{item.challanNo}</p>
                    </div>
                    <p className="text-xs text-gray-400">{item.inwardDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Outwards */}
        <div>
          <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="font-bold text-gray-800">Recent Outwards</h3>
            <Link to="/m/outward" className="text-xs text-blue-600 font-medium">View All</Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            ) : data.recentOutwards.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No recent outwards</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.recentOutwards.map((item, i) => (
                  <div key={i} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.outwardName}</p>
                      <p className="text-xs text-gray-500">{item.outwardNo}</p>
                    </div>
                    <p className="text-xs text-gray-400">{item.outwardDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Landmark, FileText, TrendingUp, TrendingDown } from "lucide-react";
import axios from "../../services/axiosInstance";
import { Api } from "../../services/api";
import StatusModal from "../../conponents/ui/StatusModal";
import Table from "../../conponents/table/Table";
import TableHeader from "../../conponents/table/TableHeader";
import TableRow from "../../conponents/table/TableRow";
import TableBody from "../../conponents/table/TableBody";

const Dashboard = () => {
  const location = useLocation();
  const [statusPopup, setStatusPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });
  
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
    // Check if user just logged in
    if (location.state?.loginSuccess) {
      setStatusPopup({
        show: true,
        message: "Login Successful",
        type: "success",
      });
      // Clear the state so the popup doesn't reappear if the user refreshes
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

  return (
    <div className="h-full flex flex-col gap-6 p-1">
      <StatusModal
        isOpen={statusPopup.show}
        message={statusPopup.message}
        type={statusPopup.type}
        onClose={() => setStatusPopup({ ...statusPopup, show: false })}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Temples */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Temples</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "..." : data.totalTemples}
            </h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <Landmark size={24} />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "..." : data.totalProducts}
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <Link to="/stock/low-alert" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Alerts</p>
            <h3 className="text-3xl font-bold text-red-600">
              {loading ? "..." : data.lowStockCount}
            </h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
        </Link>

        {/* Today's Inward */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Today's Inward</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "..." : data.todayInward}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <ArrowDownToLine size={24} />
          </div>
        </div>

        {/* Today's Outward */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Today's Outward</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "..." : data.todayOutward}
            </h3>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <ArrowUpFromLine size={24} />
          </div>
        </div>

        {/* Day Stock Report */}
        <Link to="/stock/day-report" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Stock Report (Daily)</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "..." : data.dailyReportCount}
            </h3>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
            <FileText size={24} />
          </div>
        </Link>

        {/* Fast Moving */}
        <Link to="/stock/fast-moving" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Fast Moving</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "..." : data.fastMovingCount}
            </h3>
          </div>
          <div className="w-12 h-12 bg-lime-50 text-lime-600 rounded-full flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </Link>

        {/* Slow Moving */}
        <Link to="/stock/slow-moving" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Slow Moving</p>
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "..." : data.slowMovingCount}
            </h3>
          </div>
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
            <TrendingDown size={24} />
          </div>
        </Link>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Recent Inwards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Inwards</h2>
            <Link to="/inward" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader
                columns={[
                  { label: "Challan No", key: "challanNo", sort: false, search: false },
                  { label: "Vendor", key: "vendorName", sort: false, search: false },
                  { label: "Date", key: "inwardDate", sort: false, search: false },
                ]}
                onSort={() => {}}
                onSearch={() => {}}
                filters={{}}
              />
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">Loading...</td>
                  </tr>
                ) : data.recentInwards.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">No recent inwards found</td>
                  </tr>
                ) : (
                  data.recentInwards.map((item, i) => (
                    <TableRow key={i}>
                      <td className="px-4 py-3 text-sm text-gray-600 font-medium">{item.challanNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.vendorName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.inwardDate}</td>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Outwards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Outwards</h2>
            <Link to="/outward" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader
                columns={[
                  { label: "Outward No", key: "outwardNo", sort: false, search: false },
                  { label: "Party Name", key: "outwardName", sort: false, search: false },
                  { label: "Date", key: "outwardDate", sort: false, search: false },
                ]}
                onSort={() => {}}
                onSearch={() => {}}
                filters={{}}
              />
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">Loading...</td>
                  </tr>
                ) : data.recentOutwards.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">No recent outwards found</td>
                  </tr>
                ) : (
                  data.recentOutwards.map((item, i) => (
                    <TableRow key={i}>
                      <td className="px-4 py-3 text-sm text-gray-600 font-medium">{item.outwardNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.outwardName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.outwardDate}</td>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

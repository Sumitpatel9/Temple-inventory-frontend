import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileStatusBadge from "../../components/MobileStatusBadge";
import MobileDateDisplay from "../../components/MobileDateDisplay";
import { ArrowLeft, User, Hash, Package, Calendar } from "lucide-react";

const tabs = [
  { id: "transaction", label: "Transactions" },
  { id: "inward", label: "Inward" },
  { id: "outward", label: "Outward" },
];

export default function MobileStockDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state?.product;

  const [activeTab, setActiveTab] = useState("transaction");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [inwardList, setInwardList] = useState([]);
  const [outwardList, setOutwardList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [tRes, iRes, oRes] = await Promise.all([
          axios.post(Api.transactionHistory, { productId: id }, { headers }),
          axios.post(Api.inwardHistory, { productId: id }, { headers }),
          axios.post(Api.outwardHistory, { productId: id }, { headers }),
        ]);
        setTransactionHistory(tRes.data || []);
        setInwardList(iRes.data || []);
        setOutwardList(oRes.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => navigate("/stock-m")} className="p-1.5 rounded-lg border border-gray-200">
            <ArrowLeft size={16} className="text-gray-600" />
          </button>
          <h2 className="text-base font-semibold text-gray-800 flex-1">{productData?.productName || "—"}</h2>
          <MobileStatusBadge status={productData?.status} />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Category</p>
            <p className="text-sm font-semibold text-gray-700">{productData?.category || "—"}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Min Stock</p>
            <p className="text-sm font-semibold text-gray-700">{productData?.minQty || 0} {productData?.uom}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Available</p>
            <p className="text-sm font-semibold text-orange-600">{productData?.currentStock || 0} {productData?.uom}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Reck: {productData?.warehouseReck || "—"}</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-sm font-medium transition ${activeTab === tab.id ? "bg-orange-500 text-white" : "text-gray-500"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-2">
          {activeTab === "transaction" && (
            transactionHistory.length === 0 ? <div className="text-center py-8 text-gray-400">No Data</div> :
            transactionHistory.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <MobileStatusBadge status={item.type} />
                  <span className="text-xs text-gray-400"><MobileDateDisplay date={item.date} /></span>
                </div>
                <p className="text-sm font-medium text-gray-800">{item.transactionNo}</p>
                <p className="text-xs text-gray-500">{item.name}</p>
                <p className="text-xs font-semibold text-gray-700 mt-1">Qty: {item.qty} {item.uom}</p>
                {item.remarks && <p className="text-xs text-gray-400">{item.remarks}</p>}
              </div>
            ))
          )}
          {activeTab === "inward" && (
            inwardList.length === 0 ? <div className="text-center py-8 text-gray-400">No Data</div> :
            inwardList.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">{item.challanNo}</p>
                  <span className="text-xs text-gray-400"><MobileDateDisplay date={item.inwardDate} /></span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Hash size={11} />{item.challanNo}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><User size={11} />{item.vendorName}</p>
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1"><Package size={11} />{item.qty} {item.uom}</p>
                <div className="flex gap-3 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1"><Hash size={10} />{item.batchNo}</span>
                  <span className="flex items-center gap-1"><Calendar size={10} />{item.expDate}</span>
                </div>
              </div>
            ))
          )}
          {activeTab === "outward" && (
            outwardList.length === 0 ? <div className="text-center py-8 text-gray-400">No Data</div> :
            outwardList.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">{item.outwardNo}</p>
                  <span className="text-xs text-gray-400"><MobileDateDisplay date={item.outwardDate} /></span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1"><User size={11} />{item.outwardName}</p>
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1"><Package size={11} />{item.qty} {item.uom}</p>
                {item.remarks && <p className="text-xs text-gray-400">{item.remarks}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "../../services/axiosInstance";
import { Api } from "../../services/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import StockHeader from "./stockdetails sections/StockHeader";
import TransactionHistory from "./stockdetails sections/TransactionHistory";
import InwardHistory from "./stockdetails sections/InwardHistory";
import OutwardHistory from "./stockdetails sections/OutwardHistory";

const StockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state?.product;

  const [activeTab, setActiveTab] = useState("transaction");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [inwardList, setInwardList] = useState([]);
  const [outwardList, setOutwardList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",

    type: "",
    transactionNo: "",
    name: "",
    qty: "",
    date: "",

    challanNo: "",
    vendorName: "",

    outwardNo: "",
    outwardName: "",

    sortField: "",
    sortOrder: "asc",
  });

  const productId = id;

  const fetchData = async () => {
    if (!productId) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [transactionRes, inwardRes, outwardRes] = await Promise.all([
        axios.post(
          Api.transactionHistory,
          { productId, ...filters },
          { headers },
        ),
        axios.post(Api.inwardHistory, { productId, ...filters }, { headers }),
        axios.post(Api.outwardHistory, { productId, ...filters }, { headers }),
      ]);

      setTransactionHistory(transactionRes.data || []);
      setInwardList(inwardRes.data || []);
      setOutwardList(outwardRes.data || []);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortOrder:
        prev.sortField === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleSearch = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      const updated = {
        ...prev,
        [name]: value,
        search: value,
      };

      return updated;
    });
  };
  useEffect(() => {
    fetchData();
  }, [productId, filters]);

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-medium border-b-2 cursor-pointer ${
        activeTab === id
          ? "border-orange-600 text-orange-600"
          : "border-transparent text-gray-500"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <StockHeader
        productData={productData || {}}
        onBack={() => navigate("/stock")}
      />

      <div className="bg-white rounded shadow flex flex-col h-113">
        <div className="flex border-b">
          <TabButton id="transaction" label="Transaction History" />
          <TabButton id="inward" label="Inward" />
          <TabButton id="outward" label="Outward" />
        </div>

        {activeTab === "transaction" && (
          <TransactionHistory
            transactionHistory={transactionHistory}
            loading={loading}
            filters={filters}
            handleSort={handleSort}
            handleSearch={handleSearch}
          />
        )}

        {activeTab === "inward" && (
          <InwardHistory
            inwardList={inwardList}
            loading={loading}
            filters={filters}
            handleSort={handleSort}
            handleSearch={handleSearch}
          />
        )}

        {activeTab === "outward" && (
          <OutwardHistory
            outwardList={outwardList}
            loading={loading}
            filters={filters}
            handleSort={handleSort}
            handleSearch={handleSearch}
          />
        )}
      </div>
    </div>
  );
};

export default StockDetail;

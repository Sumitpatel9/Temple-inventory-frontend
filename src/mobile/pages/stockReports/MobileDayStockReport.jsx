import { useState, useEffect, useCallback } from "react";
import { ArrowUpDown } from "lucide-react";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import MobileStatusBadge from "../../components/MobileStatusBadge";
import MobileDateDisplay from "../../components/MobileDateDisplay";
import MobileSearchBar from "../../components/MobileSearchBar";
import MobileSortModal from "../../components/MobileSortModal";

const SORT_FIELDS = [
  { label: "Date", value: "date" },
  { label: "Product Name", value: "productName" },
  { label: "Qty", value: "qty" },
  { label: "Transaction No", value: "transactionNo" },
];

export default function MobileDayStockReport() {
  const today = new Date().toISOString().split("T")[0];
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSort, setShowSort] = useState(false);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = { search, startDate, endDate };
      if (sortField) { body.sortField = sortField; body.sortOrder = sortOrder; }
      const res = await axios.post(Api.dailyStockReport, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, startDate, endDate, sortField, sortOrder]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  return (
    <div className="p-4 space-y-3">
      {/* Search + Sort row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <MobileSearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button
          onClick={() => setShowSort(true)}
          className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs shrink-0 transition-colors ${
            sortField ? "bg-orange-50 border-orange-300 text-orange-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <ArrowUpDown size={14} />
          <span>Sort</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : report.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No Data Found</div>
      ) : (
        report.map((r, i) => (
          <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <MobileStatusBadge status={r.type} />
              <span className="text-xs text-gray-400"><MobileDateDisplay date={r.date} /></span>
            </div>
            <p className="text-sm font-semibold text-gray-800">{r.productName}</p>
            <p className="text-xs text-gray-500">{r.transactionNo} · {r.name}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">Qty: {r.qty} {r.uom}</p>
            {r.remarks && <p className="text-xs text-gray-400">{r.remarks}</p>}
          </div>
        ))
      )}

      {showSort && (
        <MobileSortModal
          fields={SORT_FIELDS}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={(f, o) => { setSortField(f); setSortOrder(o); }}
          onClose={() => setShowSort(false)}
        />
      )}
    </div>
  );
}

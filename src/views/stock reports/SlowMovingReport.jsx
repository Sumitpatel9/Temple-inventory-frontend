import { useState, useEffect, useCallback } from "react";
import axios from "../../services/axiosInstance";
import { Api } from "../../services/api";

// Table Components
import Table from "../../conponents/table/Table";
import TableHeader from "../../conponents/table/TableHeader";
import TableRow from "../../conponents/table/TableRow";
import TableBody from "../../conponents/table/TableBody";

// UI Components
import StatusBadge from "../../conponents/ui/StatusBadge";

// Filters
import ListHeaderActions from "../../conponents/filters/ListHeaderActions";

import { exportToExcel } from "../../utils/exportExcel";
import useTableFilters from "../../hooks/useTableFilters";

const SlowMovingReport = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  const { filters, handleFilterChange, handleSort } = useTableFilters({
    search: "",
    status: "Active",
    productName: "",
    category: "",
    minQty: "",
    currentStock: "",
    warehouseReck: "",
    templeName: "",
    sortField: "productName",
    sortOrder: "asc",
  });

  const fetchSlowMoving = useCallback(async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        Api.slowMovingStock,
        { ...filters, days },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const list = Array.isArray(res.data) ? res.data : res.data.data || [];

      setProducts(list);
    } catch (error) {
      console.error("Error fetching slow moving stock:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, days]);

  useEffect(() => {
    fetchSlowMoving();
  }, [fetchSlowMoving]);

  /* EXPORT */

  const handleExport = () => {
    const columns = [
      { label: "SR", key: "sr" },
      { label: "Status", key: "status" },
      { label: "Product Name", key: "productName" },
      { label: "Category", key: "category" },
      { label: "Min Quantity", key: "minQty" },
      { label: "Current Stock", key: "currentStock" },
      { label: "UOM", key: "uom" },
      { label: "Warehouse Reck", key: "warehouseReck" },
      { label: "Temple Name", key: "templeName" },
      { label: "Last Outward Date", key: "lastOutwardDate" },
    ];

    const exportData = products.map((item, index) => ({
      sr: index + 1,
      status: item.status,
      productName: item.productName,
      category: item.category,
      minQty: item.minQty,
      currentStock: item.currentStock,
      uom: item.uom,
      warehouseReck: item.warehouseReck,
      templeName: item.templeName,
      lastOutwardDate: item.lastOutwardDate,
    }));

    const fileName = `Slow_Moving_Report_${
      new Date().toISOString().split("T")[0]
    }`;

    exportToExcel(exportData, columns, fileName);
  };

  return (
    <div className="h-full flex flex-col">
      <ListHeaderActions
        showAddButton={false}
        showExportButton={true}
        onExport={handleExport}
        fields={[
          {
            type: "search",
            props: {
              name: "search",
              value: filters.search,
              onChange: handleFilterChange,
            },
          },
          {
            type: "select",
            options: [
              { label: "Last 30 Days", value: 30 },
              { label: "Last 60 Days", value: 60 },
              { label: "Last 90 Days", value: 90 },
            ],
            props: {
              value: days,
              onChange: (e) => setDays(Number(e.target.value)),
            },
          },
        ]}
      />

      <Table>
        <TableHeader
          onSort={handleSort}
          onSearch={handleFilterChange}
          filters={filters}
          columns={[
            { label: "SR.", key: "sr", search: false, sort: false },
            { label: "Status", key: "status", sort: false },
            { label: "Product Name", key: "productName" },
            { label: "Category", key: "category" },
            { label: "Min Quantity", key: "minQty" },
            { label: "Current Stock", key: "currentStock" },
            { label: "Warehouse Reck", key: "warehouseReck" },
            { label: "Temple Name", key: "templeName" },
            { label: "Last Outward Date", key: "lastOutwardDate" },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-6">
                No Data Found
              </td>
            </tr>
          ) : (
            products.map((p, i) => (
              <TableRow key={i}>
                <td className="px-4 py-3 font-medium text-gray-600">{i + 1}</td>

                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>

                <td className="px-4 py-3">{p.productName}</td>

                <td className="px-4 py-3">{p.category}</td>

                <td className="px-4 py-3">
                  {p.minQty} {p.uom}
                </td>

                <td className="px-4 py-3 font-semibold">
                  {p.currentStock} {p.uom}
                </td>

                <td className="px-4 py-3">{p.warehouseReck}</td>

                <td className="px-4 py-3">{p.templeName || "—"}</td>

                <td className="px-4 py-3">{p.lastOutwardDate || "—"}</td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SlowMovingReport;

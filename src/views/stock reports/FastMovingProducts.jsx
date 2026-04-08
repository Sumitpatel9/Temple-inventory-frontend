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

const FastMovingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleSort } = useTableFilters({
    search: "",
    productName: "",
    status:"Active",
    category: "",
    minQty: "",
    currentStock: "",
    warehouseReck: "",
    templeName: "",
    sortField: "movementScore",
    sortOrder: "desc",
  });

  const fetchFastMoving = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(Api.fastMovingStock, filters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list = Array.isArray(res.data) ? res.data : res.data.data || [];

      setProducts(list);
    } catch (error) {
      console.error("Error fetching fast moving products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFastMoving();
  }, [fetchFastMoving]);

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
      { label: "Outward Qty", key: "outwardQty" },
      { label: "Transaction Count", key: "transactionCount" },
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
      outwardQty: item.outwardQty,
      transactionCount: item.transactionCount,
    }));

    const fileName = `Fast_Moving_Products_${new Date()
      .toISOString()
      .split("T")[0]}`;

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
            { label: "Outward Qty", key: "outwardQty" },
            { label: "Transactions", key: "transactionCount" },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center py-6">
                No Data Found
              </td>
            </tr>
          ) : (
            products.map((p, i) => (
              <TableRow key={i}>
                <td className="px-4 py-3 font-medium text-gray-600">
                  {i + 1}
                </td>

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

                <td className="px-4 py-3 font-semibold">
                  {p.outwardQty} {p.uom}
                </td>

                <td className="px-4 py-3">
                  {p.transactionCount}
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FastMovingProducts;
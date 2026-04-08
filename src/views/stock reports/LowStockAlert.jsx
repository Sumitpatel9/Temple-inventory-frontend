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

// Filter Components
import ListHeaderActions from "../../conponents/filters/ListHeaderActions";

import { exportToExcel } from "../../utils/exportExcel";
import useTableFilters from "../../hooks/useTableFilters";

const LowStockAlert = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleSort } = useTableFilters({
    search: "",
    productName: "",
    category: "",
    minQty: "",
    currentStock: "",
    warehouseReck: "",
    templeName: "",
    status: "Active",
    sortField: "createdAt",
    sortOrder: "desc",
  });

  const fetchLowStock = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(Api.lowStockAlert, filters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list = Array.isArray(res.data) ? res.data : res.data.data || [];

      setProducts(list);
    } catch (error) {
      console.error("Error fetching low stock:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLowStock();
  }, [fetchLowStock]);

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
    }));

    const fileName = `Low_Stock_Alert_${new Date().toISOString().split("T")[0]}`;

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
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-6">
                No Data Found
              </td>
            </tr>
          ) : (
            products.map((u, i) => (
              <TableRow key={i}>
                <td className="px-4 py-3 text-gray-600 font-medium whitespace-nowrap">
                  {i + 1}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={u.status} />
                </td>

                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {u.productName}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {u.category}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {u.minQty} {u.uom}
                </td>

                <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">
                  {u.currentStock < u.minQty ? (
                    <span className="text-red-600 font-bold">
                      {u.currentStock} {u.uom}⚠ Low
                    </span>
                  ) : (
                    <span>{u.currentStock} {u.uom}</span>
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {u.warehouseReck}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {u.templeName || "—"}
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LowStockAlert;

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Table from "../../conponents/table/Table";
import TableHeader from "../../conponents/table/TableHeader";
import TableRow from "../../conponents/table/TableRow";
import TableBody from "../../conponents/table/TableBody";

import StatusBadge from "../../conponents/ui/StatusBadge";
import DateDisplay from "../../conponents/ui/DateDisplay";

import ListHeaderActions from "../../conponents/filters/ListHeaderActions";

import axios from "../../services/axiosInstance";
import { Api } from "../../services/api";
import { exportToExcel } from "../../utils/exportExcel";
import useTableFilters from "../../hooks/useTableFilters";

const Stock = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleSort } = useTableFilters({
    search: "",
    category: "",
    status:"Active",
    sortField: "createdAt",
    sortOrder: "desc",
  });

  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All Categories", value: "" },
  ]);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(Api.productList, filters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ================= FETCH CATEGORY =================
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        Api.productCategory,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formatted = res.data.map((cat) => ({
        label: cat,
        value: cat,
      }));

      setCategoryOptions([
        { label: "All Categories", value: "" },
        ...formatted,
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleExport = () => {
    const columns = [
      { label: "SR", key: "sr" },
      { label: "Status", key: "status" },
      { label: "Product Name", key: "productName" },
      { label: "Categories", key: "category" },
      { label: "Min Quantity", key: "minQty" },
      { label: "Current Stock", key: "currentStock" },
    ];
    const fileName = `Stock_List_${new Date().toISOString().split("T")[0]}`;
    exportToExcel(products, columns, fileName);
  };

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
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
            options: categoryOptions,
            props: {
              name: "category",
              value: filters.category,
              onChange: handleFilterChange,
            },
          },
        ]}
      />

      {/* TABLE */}
      <Table>
        <TableHeader
          onSort={handleSort}
          onSearch={handleFilterChange}
          filters={filters}
          columns={[
            { label: "SR.", key: "sr", search: false, sort: false },
            { label: "Status", key: "status", search: false, sort: false },
            { label: "Product Name", key: "productName" },
            { label: "Categories", key: "category" },
            { label: "Min Quantity", key: "minQty" },
            { label: "Current Stock", key: "currentStock" },
            { label: "Warehouse reck", key: "warehouseReck" },
            { label: "Temple name", key: "templeName" },
            {
              label: "Last Inward",
              key: "lastInwardDate",
              search: false,
            },
            {
              label: "Last Outward",
              key: "lastOutwardDate",
              search: false,
            },
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
            products.map((u, i) => (
              <TableRow
                className="cursor-pointer"
                key={u._id || i}
                onClick={() =>
                  navigate(`/stock/${u._id}`, { state: { product: u } })
                }
              >
                <td className="px-4 py-3">{i + 1}</td>

                <td className="px-4 py-3">
                  <StatusBadge status={u.status} />
                </td>

                <td className="px-4 py-3">{u.productName}</td>

                <td className="px-4 py-3">{u.category}</td>

                <td className="px-4 py-3">
                  {u.minQty} {u.uom}
                </td>

                <td className="px-4 py-3 font-semibold">
                  {/* {u.currentStock} {u.uom} */}
                  {u.currentStock < u.minQty ? (
                    <span className="text-red-600 font-semibold">
                      {u.currentStock} {u.uom} ⚠
                    </span>
                  ) : (
                    <span>
                      {u.currentStock} {u.uom}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">{u.warehouseReck}</td>

                <td className="px-4 py-3">{u.templeName || "—"}</td>

                <td className="px-4 py-3">
                  <DateDisplay date={u.lastInwardDate} />
                </td>

                <td className="px-4 py-3">
                  <DateDisplay date={u.lastOutwardDate} />
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Stock;

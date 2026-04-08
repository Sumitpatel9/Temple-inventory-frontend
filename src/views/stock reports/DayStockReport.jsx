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
import DateDisplay from "../../conponents/ui/DateDisplay";

// Filters
import ListHeaderActions from "../../conponents/filters/ListHeaderActions";

import { exportToExcel } from "../../utils/exportExcel";
import useTableFilters from "../../hooks/useTableFilters";

const DayStockReport = () => {

  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const { filters, handleFilterChange, handleSort } = useTableFilters({
    search: "",
    type: "",
    transactionNo: "",
    name: "",
    productName: "",
    qty: "",
    startDate: today,
    endDate: "",
    sortField: "date",
    sortOrder: "desc",
  });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        Api.dailyStockReport,
        filters,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const list = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setReport(list);

    } catch (error) {
      console.error("Error fetching daily stock report:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);



  const handleExport = () => {

    const columns = [
      { label: "SR", key: "sr" },
      { label: "Type", key: "type" },
      { label: "Transaction No", key: "transactionNo" },
      { label: "Name", key: "name" },
      { label: "Product Name", key: "productName" },
      { label: "Quantity", key: "qty" },
      { label: "Remarks", key: "remarks" },
      { label: "Date", key: "date" },
    ];

    const exportData = report.map((r, i) => ({
      sr: i + 1,
      type: r.type,
      transactionNo: r.transactionNo,
      name: r.name,
      productName: r.productName,
      qty: `${r.qty} ${r.uom}`,
      remarks: r.remarks,
      date: r.date?.split("T")[0],
    }));

    const fileName = `Daily_Stock_Report_${new Date()
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
          {
            type: "date",
            placeholder: "START DATE",
            props: {
              name: "startDate",
              value: filters.startDate,
              onChange: handleFilterChange,
            },
          },
          {
            type: "date",
            placeholder: "END DATE",
            props: {
              name: "endDate",
              value: filters.endDate,
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
            { label: "Type", key: "type", search: false, sort: false },
            { label: "Transaction No", key: "transactionNo" },
            { label: "Name", key: "name" },
            { label: "Product Name", key: "productName" },
            { label: "Qty", key: "qty" },
            { label: "Remarks", key: "remarks", search: false },
            { label: "Date", key: "date", search: false },
          ]}
        />


        <TableBody>

          {loading ? (
            <tr>
              <td colSpan="8" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : report.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-6">
                No Data Found
              </td>
            </tr>
          ) : (
            report.map((r, i) => (
              <TableRow key={i}>

                <td className="px-4 py-3 font-medium text-gray-600">
                  {i + 1}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={r.type} />
                </td>

                <td className="px-4 py-3">
                  {r.transactionNo}
                </td>

                <td className="px-4 py-3">
                  {r.name}
                </td>

                <td className="px-4 py-3">
                  {r.productName}
                </td>

                <td className="px-4 py-3 font-semibold">
                  {r.qty} {r.uom}
                </td>

                <td className="px-4 py-3">
                  {r.remarks}
                </td>

                <td className="px-4 py-3">
                  <DateDisplay date={r.date} />
                </td>

              </TableRow>
            ))
          )}

        </TableBody>
      </Table>

    </div>
  );
};

export default DayStockReport;
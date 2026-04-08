import React, { useEffect, useState, useCallback } from "react";
import axios from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Api } from "../../services/api";

// Table Components
import Table from "../../conponents/table/Table";
import TableHeader from "../../conponents/table/TableHeader";
import TableRow from "../../conponents/table/TableRow";
import TableBody from "../../conponents/table/TableBody";

// UI Components
import StatusBadge from "../../conponents/ui/StatusBadge";
import DateDisplay from "../../conponents/ui/DateDisplay";

// Filter & Action Components
import ListHeaderActions from "../../conponents/filters/ListHeaderActions";
import TableActions from "../../conponents/table/TableActions";
import StatusModal from "../../conponents/ui/StatusModal";
import { exportToExcel } from "../../utils/exportExcel";
import useTableFilters from "../../hooks/useTableFilters";

const OutwardMasterList = () => {
  const navigate = useNavigate();
  // 1. Unified State for all backend req.body fields
  const { filters, handleFilterChange, handleSort } = useTableFilters({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
    outwardName: "",
    outwardMobile: "",
    outwardNo: "",
    outwardBy: "",
    outwardDateString: "",
    createdDateString: "",
    sortField: "createdAt",
    sortOrder: "desc",
  });

  // Result Modal State (Success/Error બતાવવા માટે)
  const [modal, setModal] = useState({
    open: false,
    message: "",
    type: "",
  });

  // ✅ Delete Confirmation State (હા/ના પૂછવા માટે)
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    rowId: null,
  });

  const [outwardList, setOutwardList] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userRole = currentUser?.role;

  // 2. Reusable fetch function sending filters in POST body
  const fetchOutwardList = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(Api.outwardList, filters, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setOutwardList(res.data.data || res.data || []);
    } catch (error) {
      console.error("Error fetching outward list:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOutwardList();
  }, [fetchOutwardList]);

  const initiateDelete = (row) => {
    setDeleteConfirm({
      show: true,
      rowId: row._id,
    });
  };

  const handleDelete = async () => {
    const idToDelete = deleteConfirm.rowId;

    setDeleteConfirm({ show: false, rowId: null });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        Api.outwardDelete,
        { outwardId: idToDelete },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setModal({
        open: true,
        message: res.data.message || "Outward record deleted successfully ✅",
        type: "success",
      });

      fetchOutwardList();
    } catch (error) {
      console.error("Delete Error:", error);
      setModal({
        open: true,
        message:
          error.response?.data?.message || "Failed to delete outward record ❌",
        type: "error",
      });
    }
  };

  const handleEdit = (row) => {
    navigate("/outward-detail", {
      state: {
        outwardData: row,
      },
    });
  };

  const handleExport = () => {
    const columns = [
      { label: "SR", key: "sr" },
      { label: "Status", key: "status" },
      { label: "Customer Name", key: "outwardName" },
      { label: "Customer Mobile", key: "outwardMobile" },
      { label: "Outward No", key: "outwardNo" },
      { label: "Outward Date", key: "outwardDate" },
      { label: "Outward By", key: "outwardBy" },
      { label: "Create Date", key: "createdAt" },

      { label: "Product Name", key: "productName" },
      { label: "Description", key: "remarks" },
      { label: "Qty", key: "qty" },
    ];

    const exportData = [];

    outwardList.forEach((outward, index) => {
      // Master row
      exportData.push({
        sr: index + 1,
        status: outward.status,
        outwardName: outward.outwardName,
        outwardMobile: outward.outwardMobile,
        outwardNo: outward.outwardNo,
        outwardDate: outward.outwardDate?.split("T")[0],
        outwardBy: outward.outwardBy,
        createdAt: outward.createdAt?.split("T")[0],

        productName: "",
        remarks: "",
        qty: "",
      });

      // Item rows
      outward.items?.forEach((item) => {
        exportData.push({
          sr: "",
          status: "",
          outwardName: "",
          outwardMobile: "",
          outwardNo: "",
          outwardDate: "",
          outwardBy: "",
          createdAt: "",

          productName: item.productId?.productName || "",
          remarks: item.remarks || "",
          qty: item.qty,
        });
      });
    });

    const fileName = `Outward_List_${new Date().toISOString().split("T")[0]}`;

    exportToExcel(exportData, columns, fileName);
  };

  return (
    <div className="h-full flex flex-col">
      <ListHeaderActions
        mode="navigate"
        navigateTo="/outward-detail"
        showAddButton={true}
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
            placeholder: "START OUTWARD DATE",
            props: {
              name: "startDate",
              value: filters.startDate,
              onChange: handleFilterChange,
            },
          },
          {
            type: "date",
            placeholder: "END OUTWARD DATE",
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
            { label: "Action", key: "action", search: false, sort: false },
            { label: "Status", key: "status", search: false, sort: false },
            { label: "Customer Name", key: "outwardName" },
            { label: "Customer Mobile", key: "outwardMobile" },
            { label: "Outward No", key: "outwardNo" },
            { label: "Outward By", key: "outwardBy" },
            {
              label: "Outward Date",
              key: "outwardDate",
              search: false,
            },
            {
              label: "Create Date",
              key: "createdAt",
              search: false,
            },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center py-6 text-gray-500">
                Loading...
              </td>
            </tr>
          ) : outwardList.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-6 text-gray-500">
                No Data Found
              </td>
            </tr>
          ) : (
            outwardList.map((row, i) => (
              <React.Fragment key={i}>
                <TableRow>
                  <td className="px-4 py-3 text-gray-600">{i + 1}</td>
                  <td
                    className="px-4 py-3 whitespace-nowrap"
                    style={{ minWidth: "10px", width: "10px" }}
                  >
                    <TableActions
                      row={row}
                      onEdit={handleEdit}
                      onDelete={() => initiateDelete(row)}
                      showDelete={userRole === "Admin"}
                      showEdit={true}
                    />
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ minWidth: "10px", width: "10px" }}
                  >
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.outwardName}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.outwardMobile}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.outwardNo}</td>
                  <td className="px-4 py-3 text-gray-600">{row.outwardBy}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <DateDisplay date={row.outwardDate} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <DateDisplay date={row.createdAt} />
                  </td>
                </TableRow>

                {/* Sub-Items Row */}
                <tr className="bg-gray-50 border-b">
                  <td colSpan="9" className="px-6 py-3">
                    {row.items?.map((prod, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-5 gap-6 py-2 text-sm text-gray-600 border-b last:border-none"
                      >
                        <div className="font-medium">
                          {prod.productId?.productName || "Product"}
                        </div>
                        <div>
                          Desc:{" "}
                          <span className="font-semibold">{prod.remarks}</span>
                        </div>
                        <div>
                          Qty: <span className="font-semibold">{prod.qty} {prod.productId?.uom}</span>
                        </div>
                        <div className="col-span-2"></div>
                      </div>
                    ))}
                  </td>
                </tr>
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>

      {/* ✅ ૧. કન્ફર્મેશન મોડલ (જ્યારે ડિલીટ આઇકોન ક્લિક થાય) */}
      {deleteConfirm.show && (
        <StatusModal
          isOpen={deleteConfirm.show}
          type="confirm" // StatusModal માં 'confirm' ટાઇપ હોવી જોઈએ
          message="Are you sure you want to delete this outward record?"
          onClose={() => setDeleteConfirm({ show: false, rowId: null })}
          onConfirm={handleDelete} // Yes બટન પર આ ફંક્શન ચાલશે
        />
      )}

      <StatusModal
        isOpen={modal.open}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, open: false })}
      />
    </div>
  );
};

export default OutwardMasterList;

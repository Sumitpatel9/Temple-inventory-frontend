import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

// Filter Components
import ListHeaderActions from "../../conponents/filters/ListHeaderActions";
import TableActions from "../../conponents/table/TableActions";
import StatusModal from "../../conponents/ui/StatusModal";
import { exportToExcel } from "../../utils/exportExcel";
import useTableFilters from "../../hooks/useTableFilters";

const InwardMasterList = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Logic: Backend req.body pramane badha fields set karya chhe
  const { filters, handleFilterChange, handleSort } = useTableFilters({
  search: "",
  status: "",
  startDate: "",
  endDate: "",
  vendorName: "",
  vendorMobile: "",
  vendorAddress: "",
  challanNo: "",
  inwardBy:"",
  inwardDateString: "",
  createdDateString: "",
  sortField: "createdAt",
  sortOrder: "desc",
});

  const [inwardList, setInwardList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    message: "",
    type: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    rowId: null,
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userRole = currentUser?.role;

  // Logic: Backend code pramane axios.post ma 'filters' object moklyo chhe
  const fetchInward = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(Api.inwardList, filters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInwardList(res.data || []);
    } catch (error) {
      console.error("Error fetching inward list:", error);
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (row) => {
    setDeleteConfirm({
      show: true,
      rowId: row._id,
    });
  };

  const handleDelete = async (row) => {
    const idToDelete = deleteConfirm.rowId;

    setDeleteConfirm({ show: false, rowId: null });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        Api.inwardDelete,
        { inwardId: idToDelete },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setModal({
        open: true,
        message: res.data.message || "Inward deleted successfully",
        type: "success",
      });

      fetchInward();
    } catch (err) {
      console.error("Delete Error:", err);

      setModal({
        open: true,
        message:
          err.response?.data?.message || "Something went wrong while deleting!",
        type: "error",
      });
    }
  };

  const handleEdit = (row) => {
    navigate("/inward-detail", {
      state: {
        inwardData: row,
      },
    });
  };

  // Logic: Jyare pan filters badlay tyare automatically api call thase
  useEffect(() => {
    fetchInward();
  }, [filters]);

 const handleExport = () => {
  const columns = [
    { label: "SR", key: "sr" },
    { label: "Status", key: "status" },
    { label: "Vendor Name", key: "vendorName" },
    { label: "Vendor Mobile", key: "vendorMobile" },
    { label: "Vendor Address", key: "vendorAddress" },
    { label: "Inward No", key: "challanNo" },
    { label: "Inward By", key: "inwardBy" },
    { label: "Inward Date", key: "inwardDate" },
    { label: "Create Date", key: "createdAt" },

    { label: "Product Name", key: "productName" },
    { label: "Description", key: "remarks" },
    { label: "Qty", key: "qty" },
    { label: "Batch No", key: "batchNo" },
    { label: "Exp Date", key: "expDate" },
  ];

  const exportData = [];

  inwardList.forEach((inward, index) => {

    // Master row
    exportData.push({
      sr: index + 1,
      status: inward.status,
      vendorName: inward.vendorName,
      vendorMobile: inward.vendorMobile,
      vendorAddress: inward.vendorAddress,
      challanNo: inward.challanNo,
      inwardBy: inward.inwardBy,
      inwardDate: inward.inwardDate?.split("T")[0],
      createdAt: inward.createdAt?.split("T")[0],
      productName: "",
      remarks: "",
      qty: "",
      batchNo: "",
      expDate: "",
    });

    // Item rows
    inward.items?.forEach((item) => {
      exportData.push({
        sr: "",
        status: "",
        vendorName: "",
        vendorMobile: "",
        vendorAddress: "",
        challanNo: "",
        inwardBy:"",
        inwardDate: "",
        createdAt: "",
        productName: item.productId?.productName || "",
        remarks: item.remarks || "",
        qty: item.qty,
        batchNo: item.batchNo,
        expDate: item.expDate?.split("T")[0],
      });
    });

  });
  const fileName = `Inward_List_${new Date().toISOString().split("T")[0]}`;

  exportToExcel(exportData, columns, fileName);
};

  return (
    <div className="h-full flex flex-col">
      <ListHeaderActions
        mode="navigate"
        navigateTo="/inward-detail"
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
            placeholder: "START INWARD DATE",
            props: {
              name: "startDate",
              value: filters.startDate,
              onChange: handleFilterChange,
            },
          },
          {
            type: "date",
            placeholder: "END INWARD DATE",
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
            { label: "SR.", key: "sr", search: false, sort: false  },
            { label: "Action", key: "action", search: false, sort: false  },
            { label: "Status", key: "status", search: false, sort: false  },
            { label: "Vendor Name", key: "vendorName" },
            { label: "Vendor Mobile", key: "vendorMobile" },
            { label: "Vendor Address", key: "vendorAddress" },
            { label: "Inward No", key: "challanNo" },
            { label: "Inward By", key: "inwardBy" },
            { label: "Inward Date", key: "inwardDateString", search: false },
            { label: "Create Date", key: "createdDateString", search: false },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : !Array.isArray(inwardList) || inwardList.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center py-6">
                No Data Found
              </td>
            </tr>
          ) : (
            inwardList.map((row, i) => (
              <React.Fragment key={i}>
                <TableRow>
                  <td className="px-4 py-3 font-medium text-gray-600">
                    {i + 1}
                  </td>
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
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.vendorName}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.vendorMobile}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.vendorAddress}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.challanNo}</td>
                  <td className="px-4 py-3 text-gray-600">{row.inwardBy}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <DateDisplay date={row.inwardDate} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <DateDisplay date={row.createdAt} />
                  </td>
                </TableRow>

                <tr className="bg-gray-50 border-b">
                  <td colSpan="10" className="px-6 py-3">
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
                        <div>
                          Batch:{" "}
                          <span className="font-semibold">{prod.batchNo}</span>
                        </div>
                        <div>
                          Exp:{" "}
                          <span className="font-semibold">
                            {prod.expDate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
      {deleteConfirm.show && (
        <StatusModal
          isOpen={deleteConfirm.show}
          type="confirm"
          message="Are you sure you want to delete this inward record?"
          onClose={() => setDeleteConfirm({ show: false, rowId: null })}
          onConfirm={handleDelete}
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

export default InwardMasterList;

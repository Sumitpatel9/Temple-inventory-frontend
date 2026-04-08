import Table from "../../../conponents/table/Table";
import TableBody from "../../../conponents/table/TableBody";
import TableHeader from "../../../conponents/table/TableHeader";
import TableRow from "../../../conponents/table/TableRow";
import DateDisplay from "../../../conponents/ui/DateDisplay";

const InwardHistory = ({ inwardList, loading, filters, handleSort, handleSearch }) => {
  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <Table className="flex-1">
        <TableHeader
          filters={filters}
          onSort={handleSort}
          onSearch={handleSearch}
          columns={[
            { label: "SR.", key: "sr", search: false, sort: false },
            { label: "Challan No", key: "challanNo" },
            { label: "Vendor Name", key: "vendorName" },
            { label: "Qty", key: "qty" },
            { label: "Batch No", key: "batchNo", sort: false, search: false },
            { label: "Exp Date", key: "expDate", sort: false, search: false },
            { label: "Remarks", key: "remarks", },
            { label: "Inward By", key: "inwardBy", },
            { label: "user name", key: "userName", },
            { label: "Inward Date", key: "inwardDate" },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : inwardList.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                No Data
              </td>
            </tr>
          ) : (
            inwardList.map((item, index) => (
              <TableRow key={index}>
                <td className="px-4 py-3">{index + 1}</td>

                <td className="px-4 py-3">{item.challanNo}</td>

                <td className="px-4 py-3">{item.vendorName}</td>

                <td className="px-4 py-3">
                  {item.qty} {item.uom}
                </td>

                <td className="px-4 py-3">{item.batchNo}</td>

                <td className="px-4 py-3">{item.expDate}</td>

                <td className="px-4 py-3">{item.remarks}</td>
                <td className="px-4 py-3">{item.inwardBy}</td>
                <td className="px-4 py-3">{item.userName}</td>

                <td className="px-4 py-3">
                  <DateDisplay date={item.inwardDate} />
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InwardHistory;

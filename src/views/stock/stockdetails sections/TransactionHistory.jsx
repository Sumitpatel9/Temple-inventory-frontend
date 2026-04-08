import Table from "../../../conponents/table/Table";
import TableBody from "../../../conponents/table/TableBody";
import TableHeader from "../../../conponents/table/TableHeader";
import TableRow from "../../../conponents/table/TableRow";
import DateDisplay from "../../../conponents/ui/DateDisplay";
import StatusBadge from "../../../conponents/ui/StatusBadge";

const TransactionHistory = ({
  transactionHistory,
  loading,
  filters,
  handleSort,
  handleSearch,
}) => {
  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <Table className="flex-1">
        <TableHeader
          filters={filters}
          onSort={handleSort}
          onSearch={handleSearch}
          columns={[
            { label: "SR.", key: "sr", search: false, sort: false },
            { label: "Type", key: "type", search: false, sort: false },
            { label: "Transaction No", key: "transactionNo" },
            { label: "Name", key: "name" },
            { label: "Qty", key: "qty" },
            { label: "Remarks", key: "remarks" },
            { label: "Date", key: "date" },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : transactionHistory.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No Data
              </td>
            </tr>
          ) : (
            transactionHistory.map((item, index) => (
              <TableRow key={index}>
                <td className="px-4 py-3">{index + 1}</td>

                <td className="px-4 py-3">
                  <StatusBadge status={item.type} />
                </td>

                <td className="px-4 py-3">{item.transactionNo}</td>

                <td className="px-4 py-3">{item.name}</td>

                <td className="px-4 py-3">
                  {item.qty} {item.uom}
                </td>

                <td className="px-4 py-3">{item.remarks}</td>

                <td className="px-4 py-3">
                  <DateDisplay date={item.date} />
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionHistory;

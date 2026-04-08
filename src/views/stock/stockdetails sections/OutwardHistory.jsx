import Table from "../../../conponents/table/Table";
import TableBody from "../../../conponents/table/TableBody";
import TableHeader from "../../../conponents/table/TableHeader";
import TableRow from "../../../conponents/table/TableRow";
import DateDisplay from "../../../conponents/ui/DateDisplay";

const OutwardHistory = ({ outwardList, loading, filters, handleSort, handleSearch }) => {
  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <Table className="flex-1">
        <TableHeader
          filters={filters}
          onSort={handleSort}
          onSearch={handleSearch}
          columns={[
            { label: "SR.", key: "sr", search: false, sort: false },
            { label: "Outward No", key: "outwardNo" },
            { label: "Customer Name", key: "outwardName" },
            { label: "Qty", key: "qty" },
            { label: "Remarks", key: "remarks" },
            { label: "Outward By", key: "outwardBy" },
            { label: "user name", key: "userName" },
            { label: "Outward Date", key: "outwardDate" },
          ]}
        />

        <TableBody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : outwardList.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No Data
              </td>
            </tr>
          ) : (
            outwardList.map((item, index) => (
              <TableRow key={index}>
                <td className="px-4 py-3">{index + 1}</td>

                <td className="px-4 py-3">{item.outwardNo}</td>

                <td className="px-4 py-3">{item.outwardName}</td>

                <td className="px-4 py-3">
                  {item.qty} {item.uom}
                </td>

                <td className="px-4 py-3">{item.remarks}</td>
                <td className="px-4 py-3">{item.outwardBy}</td>
                <td className="px-4 py-3">{item.userName}</td>

                <td className="px-4 py-3">
                  <DateDisplay date={item.outwardDate} />
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OutwardHistory;

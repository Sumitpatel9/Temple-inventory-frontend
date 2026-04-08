// export default function TableRow({ children }) {
//   return (
//     <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//       {children}
//     </tr>
//   );
// }
const TableRow = ({ children, className = "", ...props }) => {
  return (
    <tr
      {...props}
      className={`border-b border-gray-200 hover:bg-gray-50 transition ${className}`}
    >
      {children}
    </tr>
  );
};

export default TableRow;

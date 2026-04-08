// import { FaSortAmountUp } from "react-icons/fa";
// import SearchBox from "../filters/SearchBox";

// export default function TableHeader({
//   columns,
//   onSort,
//   onSearch,
//   filters,
//   disableSearch = false,
// }) {
//   return (
//     <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
//       <tr>
//         {columns.map((col, idx) => {
//           const label = typeof col === "object" ? col.label : col;
//           const key =
//             typeof col === "object" ? col.key : col.trim().toLowerCase();

//           const noSearchColumns = [
//             "sr.",
//             "action",
//             "actions",
//             "status",
//             "user status",
//             "inward date",
//             "create date",
//             "outward date",
//             "last login",
//             "last inward",
//             "last outward",
//             "password"
//           ];

//           const hideSearch =
//             disableSearch || noSearchColumns.includes(label.toLowerCase());
//           const hideSort = hideSearch;

//           return (
//             <th
//               key={idx}
//               className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap border-b border-gray-200"
//               style={{
//                 minWidth:
//                   key === "sr"
//                     ? "40px"
//                     : key === "actions"
//                       ? "70px"
//                       : key === "status"
//                         ? "80px"
//                         : "120px",
//                 width:
//                   key === "sr"
//                     ? "40px"
//                     : key === "actions"
//                       ? "70px"
//                       : key === "status"
//                         ? "80px"
//                         : "auto",
//               }}
//             >
//               <div className="flex items-center gap-2">
//                 <span>{label}</span>

//                 {!hideSort && (
//                   <FaSortAmountUp
//                     onClick={() => onSort(key)}
//                     className="cursor-pointer transition-transform duration-300"
//                     style={{
//                       transform:
//                         filters.sortField === key && filters.sortOrder === "asc"
//                           ? "rotate(180deg)"
//                           : "rotate(0deg)",
//                     }}
//                   />
//                 )}
//               </div>

//               {!hideSearch && (
//                 <SearchBox
//                   name={key}
//                   value={filters[key] || ""}
//                   onChange={onSearch}
//                   className="w-35 mt-2 bg-white border border-gray-300 text-gray-600 placeholder-gray-400 rounded px-3 py-0.5 text-sm focus:outline-none focus:border-gray-400 transition"
//                 />
//               )}
//             </th>
//           );
//         })}
//       </tr>
//     </thead>
//   );
// }


// import { FaSortAmountUp } from "react-icons/fa";
// import SearchBox from "../filters/SearchBox";

// export default function TableHeader({
//   columns,
//   onSort,
//   onSearch,
//   filters,
// }) {
//   return (
//     <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
//       <tr>
//         {columns.map((col, idx) => {
//           const label = typeof col === "object" ? col.label : col;
//           const key =
//             typeof col === "object" ? col.key : col.trim().toLowerCase();

//           // ✅ control flags
//           const showSearch = typeof col === "object" ? col.search !== false : true;
//           const showSort = typeof col === "object" ? col.sort !== false : true;

//           return (
//             <th
//               key={idx}
//               className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap border-b border-gray-200"
//               style={{
//                 minWidth:
//                   key === "sr"
//                     ? "40px"
//                     : key === "actions"
//                     ? "70px"
//                     : key === "status"
//                     ? "80px"
//                     : "120px",
//               }}
//             >
//               <div className="flex items-center gap-2">
//                 <span>{label}</span>

//                 {showSort && (
//                   <FaSortAmountUp
//                     onClick={() => onSort(key)}
//                     className="cursor-pointer transition-transform duration-300"
//                     style={{
//                       transform:
//                         filters.sortField === key && filters.sortOrder === "asc"
//                           ? "rotate(180deg)"
//                           : "rotate(0deg)",
//                     }}
//                   />
//                 )}
//               </div>

//               {showSearch && (
//                 <SearchBox
//                   name={key}
//                   value={filters[key] || ""}
//                   onChange={onSearch}
//                   className="w-35 mt-2 bg-white border border-gray-300 text-gray-600 placeholder-gray-400 rounded px-3 py-0.5 text-sm focus:outline-none focus:border-gray-400 transition"
//                 />
//               )}
//             </th>
//           );
//         })}
//       </tr>
//     </thead>
//   );
// }

import { FaSortAmountUp } from "react-icons/fa";
import SearchBox from "../filters/SearchBox";

export default function TableHeader({
  columns,
  onSort,
  onSearch,
  filters,
}) {
  return (
    <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
      <tr>
        {columns.map((col, idx) => {
          const label = typeof col === "object" ? col.label : col;
          const key =
            typeof col === "object" ? col.key : col.trim().toLowerCase();

          const showSearch =
            typeof col === "object" ? col.search !== false : true;
          const showSort =
            typeof col === "object" ? col.sort !== false : true;

          return (
            <th
              key={idx}
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap border-b border-gray-200"
              style={{
                minWidth:
                  key === "sr"
                    ? "40px"
                    : key === "actions"
                    ? "70px"
                    : key === "status"
                    ? "120px"
                    : "120px",
              }}
            >
              <div className="flex items-center gap-2">
                <span>{label}</span>

                {showSort && (
                  <FaSortAmountUp
                    onClick={() => onSort(key)}
                    className="cursor-pointer transition-transform duration-300"
                    style={{
                      transform:
                        filters.sortField === key &&
                        filters.sortOrder === "asc"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  />
                )}
              </div>

              {/* STATUS SELECT */}
              {key === "status" && (
                <select
                  name="status"
                  value={filters.status || ""}
                  onChange={onSearch}
                  className="w-35 mt-2 bg-white border border-gray-300 text-gray-600 rounded px-2 py-0.5 text-sm focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
              )}

              {/* ROLE SELECT */}
              {key === "role" && (
                <select
                  name="role"
                  value={filters.role || ""}
                  onChange={onSearch}
                  className="w-35 mt-2 bg-white border border-gray-300 text-gray-600 rounded px-2 py-0.5 text-sm focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              )}

              {/* TYPE SELECT */}
              {key === "type" && (
                <select
                  name="type"
                  value={filters.type || ""}
                  onChange={onSearch}
                  className="w-35 mt-2 bg-white border border-gray-300 text-gray-600 rounded px-2 py-0.5 text-sm focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="INWARD">Inward</option>
                  <option value="OUTWARD">Outward</option>
                </select>
              )}

              {/* NORMAL SEARCH INPUT */}
              {showSearch && key !== "status" && key !== "role" && (
                <SearchBox
                  name={key}
                  value={filters[key] || ""}
                  onChange={onSearch}
                  className="w-35 mt-2 bg-white border border-gray-300 text-gray-600 placeholder-gray-400 rounded px-3 py-0.5 text-sm focus:outline-none focus:border-gray-400 transition"
                />
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
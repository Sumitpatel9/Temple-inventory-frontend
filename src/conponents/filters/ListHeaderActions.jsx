import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import SearchBox from "./SearchBox";
import Input from "../ui/Input";

export default function ListHeaderActions({
  fields = [],
  onAdd,
  onExport,
  mode = "modal",
  navigateTo = "",
  addLabel = "+ Add",
  exportLabel = "Export",
  showAddButton = true,
  showExportButton = false,
}) {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (mode === "navigate" && navigateTo) {
      navigate(navigateTo);
    } else if (onAdd) {
      onAdd();
    }
  };

  // const renderField = (field, index) => {
  //   switch (field.type) {
  //     case "search":
  //       return (
  //         <SearchBox
  //           key={index}
  //           className="w-64 border border-gray-300 bg-white text-gray-600 px-3 py-2 outline-none rounded"
  //           {...field.props}
  //         />
  //       );

  //     case "status":
  //       return (
  //         <select
  //           key={index}
  //           className="border border-gray-300 px-3 py-2 rounded text-gray-600"
  //           {...field.props}
  //         >
  //           <option value="Active">Active</option>
  //           <option value="Deactive">Deactive</option>
  //         </select>
  //       );

  //     case "date":
  //       return (
  //         <div key={index} className="relative flex items-center group">
  //           {/* Field Label/Placeholder */}
  //           <span className="text-[10px] font-bold text-gray-500 uppercase absolute -top-2 left-2 bg-white px-1 z-10">
  //             {field.placeholder}
  //           </span>

  //           <div className="relative w-full">
  //             <Input
  //               type="date"
  //               onFocus={(e) => e.target.showPicker()}
  //               className="border border-gray-300 px-3 py-2 rounded text-sm w-full pr-8 cursor-pointer"
  //               {...field.props}
  //             />

  //             {field.props?.value && (
  //               <button
  //                 type="button"
  //                 onClick={() => {
  //                   const event = {
  //                     target: { name: field.props.name, value: "" },
  //                   };
  //                   field.props.onChange(event);
  //                 }}
  //                 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
  //               >
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   className="h-4 w-4"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="currentColor"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth={2}
  //                     d="M6 18L18 6M6 6l12 12"
  //                   />
  //                 </svg>
  //               </button>
  //             )}
  //           </div>
  //         </div>
  //       );

  //     case "select":
  //       return (
  //         <select
  //           key={index}
  //           className="border border-gray-300 px-3 py-2 w-50 rounded text-gray-600"
  //           {...field.props}
  //         >
  //           {field.options?.map((opt, i) => (
  //             <option key={i} value={opt.value}>
  //               {opt.label}
  //             </option>
  //           ))}
  //         </select>
  //       );

  //     case "custom":
  //       return <div key={index}>{field.component}</div>;

  //     default:
  //       return null;
  //   }
  // };

  const renderField = (field, index) => {
    switch (field.type) {
      case "search":
        return (
          <SearchBox
            key={index}
            className={`border border-gray-300 bg-white text-gray-600 px-3 py-2 outline-none rounded ${field.className || ""}`}
            {...field.props}
          />
        );

      case "status":
        return (
          <select
            key={index}
            className={`border border-gray-300 px-3 py-2 rounded outline-none text-gray-600 ${field.className || ""}`}
            {...field.props}
          >
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
        );

      case "date":
        return (
          <div
            key={index}
            className={`relative flex items-center group ${field.className || ""}`}
          >
            <span className="text-[10px] font-bold text-gray-500 uppercase absolute -top-2 left-2 bg-white px-1 z-10">
              {field.placeholder}
            </span>

            <div className="relative w-full">
              <Input
                type="date"
                onFocus={(e) => e.target.showPicker()}
                className={`border border-gray-300 px-3 py-2 rounded text-sm w-full pr-8 outline-none cursor-pointer ${field.inputClass || ""}`}
                {...field.props}
              />

              {field.props?.value && (
                <button
                  type="button"
                  onClick={() => {
                    const event = {
                      target: { name: field.props.name, value: "" },
                    };
                    field.props.onChange(event);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );

      case "select":
        return (
          <select
            key={index}
            className={`border border-gray-300 px-3 py-2 w-50 rounded outline-none text-gray-600 ${field.className || ""}`}
            {...field.props}
          >
            {field.options?.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "custom":
        return <div key={index}>{field.component}</div>;

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-center mb-4 gap-4 bg-white border border-gray-200 px-4 py-3 rounded shadow-sm">
      {/* LEFT SIDE FIELDS */}
      <div className="flex flex-wrap gap-3 items-center">
        {fields.map(renderField)}
      </div>

      <div className="flex gap-2 shrink-0">
        {showExportButton && (
          <Button variant="gold" onClick={onExport}>
            {exportLabel}
          </Button>
        )}

        {showAddButton && (
          <Button variant="gold" onClick={handleAddClick}>
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

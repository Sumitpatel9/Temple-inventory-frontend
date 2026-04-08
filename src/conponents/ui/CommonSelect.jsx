import React from "react";
import Select from "react-select";

const CommonSelect = ({
  options = [],
  value = null,
  onChange = () => {},
  placeholder = "Select...",
  getOptionValue = (opt) => opt.value,
  getOptionLabel = (opt) => opt.label,
  detailFields = [],
  menuPortalTarget = document.body,
}) => {
  const selectedOption =
    options.find((opt) => getOptionValue(opt) === value) || null;

  const renderDetails = (data) => {
    return detailFields
      .map((field) => {
        let val = data[field.key];

        if (field.key === "stock") {
          const stock =
            data.stock !== undefined && data.stock !== null ? data.stock : "-";
          const uom = data.uom || "";
          val = `${stock} ${uom}`.trim();
        } else {
          val =
            data[field.key] !== undefined && data[field.key] !== null
              ? data[field.key]
              : "-";
        }

        return `${field.label}: ${val}`;
      })
      .join(" | ");
  };

  return (
    <div className="flex flex-col w-full">
      <Select
        options={options}
        value={selectedOption}
        onChange={(selected) =>
          onChange(selected ? getOptionValue(selected) : "")
        }
        placeholder={placeholder}
        isClearable={true}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        classNamePrefix="rs"
        menuPortalTarget={menuPortalTarget}
        menuPosition="fixed"
        formatOptionLabel={(data, { context }) => {
          if (context === "value") {
            return <span>{data.label}</span>;
          }

          return (
            <div>
              <div className="font-medium">{data.label}</div>
              <div className="text-xs text-gray-500">{renderDetails(data)}</div>
            </div>
          );
        }}
        styles={{
          control: (base) => ({
            ...base,
            border: "1px solid #5F6368",
            boxShadow: "none",
            minHeight: "38px",
            borderRadius: "6px",
            "&:hover": {
              borderColor: "#FF6900", 
            },
          }),

          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#FF6900"
              : state.isFocused
                ? "#FFE4CC"
                : "white",
            color: state.isSelected ? "white" : "#374151",
          }),

          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
      />

      {/* DETAILS BELOW SELECT */}

      {selectedOption && (
        <div className="text-xs text-gray-500 mt-1">
          {renderDetails(selectedOption)}
        </div>
      )}
    </div>
  );
};

export default CommonSelect;

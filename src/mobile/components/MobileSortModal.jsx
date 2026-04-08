import { useState, useEffect } from "react";
import { X, ArrowUp, ArrowDown } from "lucide-react";

export default function MobileSortModal({ fields, sortField, sortOrder, onSort, onClose }) {
  // null = nothing selected yet (first open), otherwise keep previous selection
  const [selected, setSelected] = useState(sortField === "createdAt" ? null : sortField);
  const [order, setOrder] = useState(sortOrder);
  const [visible, setVisible] = useState(false);

  // Trigger slide-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSelect = (value) => {
    if (selected === value) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSelected(value);
      setOrder("asc");
    }
  };

  const handleApply = () => {
    onSort(selected, order);
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const selectedLabel = fields.find((f) => f.value === selected)?.label || "";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${visible ? "opacity-40" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`relative bg-white rounded-t-2xl shadow-xl max-h-[80vh] flex flex-col transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-base font-semibold text-gray-800">Sort by</span>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Fields list */}
        <div className="overflow-y-auto flex-1 py-2 px-2">
          {fields.map((field) => {
            const isSelected = selected === field.value;
            return (
              <button
                key={field.value}
                onClick={() => handleSelect(field.value)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl mb-1 transition-colors ${
                  isSelected
                    ? "bg-orange-50 border border-orange-300"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-orange-500" : "border-gray-400"
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <span className={`text-sm ${isSelected ? "text-orange-700 font-medium" : "text-gray-700"}`}>
                    {field.label}
                  </span>
                </div>
                {isSelected && (
                  <div className="flex items-center gap-1 text-orange-500 text-xs font-medium">
                    <span>{order === "asc" ? "Ascending" : "Descending"}</span>
                    {order === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <div className="mx-4 mb-3 px-4 py-3 bg-orange-50 rounded-xl flex items-start gap-2">
          <span className="text-orange-400 text-xs mt-0.5">ℹ</span>
          <span className="text-xs text-orange-600">Tap on selection to change from ascending to descending and vice versa</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-orange-500 font-medium">Sort Selected</p>
            <p className="text-sm text-gray-700 font-semibold">
              {selected ? `${selectedLabel} (${order === "asc" ? "Ascending" : "Descending"})` : "None"}
            </p>
          </div>
          <button
            onClick={handleApply}
            disabled={!selected}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Sort
          </button>
        </div>
      </div>
    </div>
  );
}

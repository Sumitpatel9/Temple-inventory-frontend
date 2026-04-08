import { ArrowUpDown } from "lucide-react";
import MobileSearchBar from "./MobileSearchBar";

/**
 * MobileFilterBar
 * Renders search + status toggle + sort icon + optional extra selects + optional Add button
 */
export default function MobileFilterBar({
  search, onSearchChange,
  status, onStatusChange,
  extraFilters = [],
  onAdd,
  addLabel = "+ Add",
  onSortOpen,          // opens sort modal
}) {
  return (
    <div className="space-y-2">
      {/* Row 1: search + add */}
      <div className="flex gap-2">
        <div className="flex-1">
          <MobileSearchBar value={search} onChange={onSearchChange} />
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0"
          >
            {addLabel}
          </button>
        )}
      </div>

      {/* Row 2: status pills + sort icon + extra selects */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* Status pill toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white text-xs font-medium shrink-0">
          {["", "Active", "Deactive"].map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-3 py-2 transition ${
                status === s
                  ? "bg-orange-500 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {s === "" ? "All" : s}
            </button>
          ))}
        </div>

        {/* Sort icon button */}
        {onSortOpen && (
          <button
            onClick={onSortOpen}
            className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 shrink-0"
          >
            <ArrowUpDown size={14} />
            <span>Sort</span>
          </button>
        )}

        {/* Extra selects (category, days, etc.) */}
        {extraFilters.map((f, i) => (
          <select
            key={i}
            value={f.value}
            onChange={f.onChange}
            className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none text-gray-600"
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}

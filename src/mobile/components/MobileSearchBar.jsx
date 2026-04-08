import { Search } from "lucide-react";

export default function MobileSearchBar({ value, onChange, name = "search", placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
      />
    </div>
  );
}

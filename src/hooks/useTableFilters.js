import { useState } from "react";

export default function useTableFilters(initialFilters) {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortOrder:
        prev.sortField === field && prev.sortOrder === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return {
    filters,
    setFilters,
    handleFilterChange,
    handleSort,
  };
}
import { FilterBar, FilterState } from "../FilterBar";
import { useState } from "react";

export default function FilterBarExample() {
  const [filters, setFilters] = useState<FilterState>({
    vegOnly: false,
    priceRange: "all",
    nearby: false,
    rating: "all",
    hasOffers: false,
    sortBy: "default",
  });

  return <FilterBar filters={filters} onFilterChange={setFilters} />;
}

import { Leaf, DollarSign, MapPin, Star, Tag, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterState {
  vegOnly: boolean;
  priceRange: string;
  nearby: boolean;
  rating: string;
  hasOffers: boolean;
  sortBy: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const toggleFilter = (key: keyof FilterState) => {
    if (typeof filters[key] === "boolean") {
      onFilterChange({ ...filters, [key]: !filters[key] });
    }
  };

  const activeFilterCount = [
    filters.vegOnly,
    filters.priceRange !== "all",
    filters.nearby,
    filters.rating !== "all",
    filters.hasOffers,
    filters.sortBy !== "default",
  ].filter(Boolean).length;

  return (
    <div className="bg-background border-b sticky top-16 md:top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={filters.vegOnly ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter("vegOnly")}
            className="gap-2 flex-shrink-0 rounded-full"
            data-testid="filter-veg"
          >
            <Leaf className="h-4 w-4" />
            Veg Only
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filters.priceRange !== "all" ? "default" : "outline"}
                size="sm"
                className="gap-2 flex-shrink-0 rounded-full"
                data-testid="filter-price"
              >
                <DollarSign className="h-4 w-4" />
                Price Range
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, priceRange: "all" })} data-testid="price-all">
                All Prices
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, priceRange: "100" })} data-testid="price-100">
                Under ₹100
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, priceRange: "200" })} data-testid="price-200">
                Under ₹200
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, priceRange: "500" })} data-testid="price-500">
                Under ₹500
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={filters.nearby ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter("nearby")}
            className="gap-2 flex-shrink-0 rounded-full"
            data-testid="filter-nearby"
          >
            <MapPin className="h-4 w-4" />
            Nearby
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filters.rating !== "all" ? "default" : "outline"}
                size="sm"
                className="gap-2 flex-shrink-0 rounded-full"
                data-testid="filter-rating"
              >
                <Star className="h-4 w-4" />
                Rating
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, rating: "all" })} data-testid="rating-all">
                All Ratings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, rating: "4+" })} data-testid="rating-4">
                4.0+ ⭐
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, rating: "4.5+" })} data-testid="rating-4.5">
                4.5+ ⭐
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={filters.hasOffers ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter("hasOffers")}
            className="gap-2 flex-shrink-0 rounded-full"
            data-testid="filter-offers"
          >
            <Tag className="h-4 w-4" />
            Offers
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filters.sortBy !== "default" ? "default" : "outline"}
                size="sm"
                className="gap-2 flex-shrink-0 rounded-full"
                data-testid="filter-sort"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, sortBy: "default" })} data-testid="sort-default">
                Default
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, sortBy: "priceLow" })} data-testid="sort-low">
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange({ ...filters, sortBy: "priceHigh" })} data-testid="sort-high">
                Price: High to Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2" data-testid="active-filter-count">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

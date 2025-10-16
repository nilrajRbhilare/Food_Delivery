import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchSuggestions } from "@/lib/mockData";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = searchSuggestions.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for food or restaurant..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 rounded-full"
          data-testid="input-search"
        />
      </div>

      {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-popover border border-popover-border rounded-xl shadow-lg z-50 overflow-hidden" data-testid="search-suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-3 hover-elevate active-elevate-2 text-sm"
              onClick={() => {
                onSearchChange(suggestion);
              }}
              data-testid={`suggestion-${index}`}
            >
              <Search className="inline h-3 w-3 mr-2 text-muted-foreground" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

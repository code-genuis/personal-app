import React, { useState } from "react";
import { Search, Filter, SlidersHorizontal, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onSortChange?: (sortBy: string) => void;
}

const FilterBar = ({
  onSearch = () => {},
  onFilterChange = () => {},
  onSortChange = () => {},
}: FilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    type: [],
    date: [],
    tags: [],
  });
  const [sortBy, setSortBy] = useState("newest");

  const mediaTypes: FilterOption[] = [
    { id: "image", label: "Images" },
    { id: "video", label: "Videos" },
    { id: "audio", label: "Audio" },
  ];

  const dateFilters: FilterOption[] = [
    { id: "today", label: "Today" },
    { id: "this-week", label: "This Week" },
    { id: "this-month", label: "This Month" },
    { id: "this-year", label: "This Year" },
  ];

  const tagFilters: FilterOption[] = [
    { id: "favorites", label: "Favorites" },
    { id: "personal", label: "Personal" },
    { id: "work", label: "Work" },
    { id: "travel", label: "Travel" },
  ];

  const sortOptions = [
    { id: "newest", label: "Newest First" },
    { id: "oldest", label: "Oldest First" },
    { id: "a-z", label: "A-Z" },
    { id: "z-a", label: "Z-A" },
    { id: "most-liked", label: "Most Liked" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter(
          (item) => item !== value,
        );
      } else {
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange(value);
  };

  const clearFilters = () => {
    setActiveFilters({
      type: [],
      date: [],
      tags: [],
    });
    onFilterChange({
      type: [],
      date: [],
      tags: [],
    });
  };

  const totalActiveFilters = Object.values(activeFilters).flat().length;

  return (
    <div className="w-full bg-background p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search your media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Filter Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {totalActiveFilters > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {totalActiveFilters}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  {totalActiveFilters > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Media Type</h4>
                  <div className="space-y-2">
                    {mediaTypes.map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`type-${type.id}`}
                          checked={activeFilters.type.includes(type.id)}
                          onCheckedChange={() => toggleFilter("type", type.id)}
                        />
                        <label
                          htmlFor={`type-${type.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Date Added</h4>
                  <div className="space-y-2">
                    {dateFilters.map((date) => (
                      <div
                        key={date.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`date-${date.id}`}
                          checked={activeFilters.date.includes(date.id)}
                          onCheckedChange={() => toggleFilter("date", date.id)}
                        />
                        <label
                          htmlFor={`date-${date.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {date.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="space-y-2">
                    {tagFilters.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={activeFilters.tags.includes(tag.id)}
                          onCheckedChange={() => toggleFilter("tags", tag.id)}
                        />
                        <label
                          htmlFor={`tag-${tag.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tag.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <h3 className="font-medium mb-2">Sort by</h3>
                {sortOptions.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent",
                      sortBy === option.id && "bg-accent",
                    )}
                    onClick={() => handleSortChange(option.id)}
                  >
                    <span className="text-sm">{option.label}</span>
                    {sortBy === option.id && <Check className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {totalActiveFilters > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(activeFilters).map(([category, values]) =>
            values.map((value) => {
              // Find the label for this filter
              let label = value;
              if (category === "type") {
                label = mediaTypes.find((t) => t.id === value)?.label || value;
              } else if (category === "date") {
                label = dateFilters.find((d) => d.id === value)?.label || value;
              } else if (category === "tags") {
                label = tagFilters.find((t) => t.id === value)?.label || value;
              }

              return (
                <Badge
                  key={`${category}-${value}`}
                  variant="secondary"
                  className="px-2 py-1"
                >
                  {label}
                  <button
                    onClick={() => toggleFilter(category, value)}
                    className="ml-1 inline-flex items-center justify-center rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            }),
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;

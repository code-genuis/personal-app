import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid3X3, List, SortAsc, SortDesc } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import MediaCard from "./MediaCard";
import FilterBar from "./FilterBar";

interface MediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  title: string;
  description: string;
  liked: boolean;
  category: string;
  dateAdded: Date;
}

interface MediaGridProps {
  items?: MediaItem[];
  onSelectMedia?: (id: string) => void;
  onLikeMedia?: (id: string) => void;
  onDownloadMedia?: (id: string) => void;
  onEditMedia?: (id: string) => void;
  onDeleteMedia?: (id: string) => void;
}

const MediaGrid = ({
  items = [
    {
      id: "media-1",
      type: "image",
      src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
      title: "Colorful Abstract",
      description: "Vibrant abstract digital art with flowing colors.",
      liked: true,
      category: "Art",
      dateAdded: new Date(2023, 5, 15),
    },
    {
      id: "media-2",
      type: "image",
      src: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80",
      title: "Mountain Landscape",
      description: "Beautiful mountain range at sunset with dramatic clouds.",
      liked: false,
      category: "Nature",
      dateAdded: new Date(2023, 6, 22),
    },
    {
      id: "media-3",
      type: "video",
      src: "https://example.com/sample-video.mp4",
      title: "Coding Tutorial",
      description: "Step-by-step guide to building a React component.",
      liked: false,
      category: "Education",
      dateAdded: new Date(2023, 7, 10),
    },
    {
      id: "media-4",
      type: "image",
      src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
      title: "Ocean Waves",
      description: "Peaceful ocean waves crashing on a sandy beach at dawn.",
      liked: true,
      category: "Nature",
      dateAdded: new Date(2023, 8, 5),
    },
    {
      id: "media-5",
      type: "image",
      src: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&q=80",
      title: "City Skyline",
      description: "Modern city skyline with skyscrapers at night.",
      liked: false,
      category: "Urban",
      dateAdded: new Date(2023, 9, 18),
    },
    {
      id: "media-6",
      type: "video",
      src: "https://example.com/sample-video2.mp4",
      title: "Drone Footage",
      description: "Aerial view of a forest captured with a drone.",
      liked: true,
      category: "Nature",
      dateAdded: new Date(2023, 10, 3),
    },
  ],
  onSelectMedia = () => {},
  onLikeMedia = () => {},
  onDownloadMedia = () => {},
  onEditMedia = () => {},
  onDeleteMedia = () => {},
}: MediaGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "dateNewest" | "dateOldest" | "titleAZ" | "titleZA"
  >("dateNewest");
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(items);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort items when dependencies change
  useEffect(() => {
    let result = [...items];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Apply sorting
    result = result.sort((a, b) => {
      switch (sortBy) {
        case "dateNewest":
          return b.dateAdded.getTime() - a.dateAdded.getTime();
        case "dateOldest":
          return a.dateAdded.getTime() - b.dateAdded.getTime();
        case "titleAZ":
          return a.title.localeCompare(b.title);
        case "titleZA":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredItems(result);
  }, [items, searchQuery, sortBy, selectedCategory]);

  // Get unique categories for filter
  const categories = ["all", ...new Set(items.map((item) => item.category))];

  return (
    <div className="w-full h-full flex flex-col space-y-4 bg-white dark:bg-gray-900 p-4">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search media..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value: any) => setSortBy(value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateNewest">Newest First</SelectItem>
              <SelectItem value="dateOldest">Oldest First</SelectItem>
              <SelectItem value="titleAZ">Title A-Z</SelectItem>
              <SelectItem value="titleZA">Title Z-A</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:flex border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-none h-10 w-10",
                viewMode === "grid" && "bg-gray-100 dark:bg-gray-800",
              )}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-none h-10 w-10",
                viewMode === "list" && "bg-gray-100 dark:bg-gray-800",
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter tags/chips */}
      <FilterBar />

      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredItems.length} of {items.length} items
      </div>

      {/* Media grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full">
              <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-3 w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-2 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <motion.div
          className={cn(
            "grid gap-6 mt-4",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                viewMode === "list" &&
                  "flex items-center space-x-4 border rounded-lg p-2",
              )}
            >
              {viewMode === "list" ? (
                <div className="flex w-full items-center space-x-4">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                    {item.type === "image" ? (
                      <img
                        src={item.src}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="relative h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <video
                          src={item.src}
                          className="h-full w-full object-cover"
                          muted
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.dateAdded.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLikeMedia(item.id)}
                    >
                      {item.liked ? "Unlike" : "Like"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadMedia(item.id)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditMedia(item.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => onDeleteMedia(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <MediaCard
                  id={item.id}
                  type={item.type}
                  src={item.src}
                  title={item.title}
                  description={item.description}
                  liked={item.liked}
                  onLike={onLikeMedia}
                  onDownload={onDownloadMedia}
                  onEdit={onEditMedia}
                  onDelete={onDeleteMedia}
                  onSelect={onSelectMedia}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">No results found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            We couldn't find any media matching your search. Try adjusting your
            filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaGrid;

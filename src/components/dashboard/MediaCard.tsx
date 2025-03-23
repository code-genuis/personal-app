import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Heart, Download, MoreVertical, Image, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface MediaCardProps {
  id?: string;
  type?: "image" | "video";
  src?: string;
  title?: string;
  description?: string;
  liked?: boolean;
  onLike?: (id: string) => void;
  onDownload?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
}

const MediaCard = ({
  id = "media-1",
  type = "image",
  src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
  title = "Beautiful Sunset",
  description = "Captured this amazing sunset at the beach last weekend.",
  liked = false,
  onLike = () => {},
  onDownload = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onSelect = () => {},
}: MediaCardProps) => {
  const [isLiked, setIsLiked] = React.useState(liked);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <Card
      className="w-full max-w-[320px] overflow-hidden transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800"
      onClick={() => onSelect(id)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {type === "image" ? (
          <img
            src={src}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
          />
        ) : (
          <div className="relative h-full w-full">
            <video src={src} className="h-full w-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Video className="h-12 w-12 text-white opacity-80" />
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-500 focus:text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg truncate">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10 mt-1">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLiked ? "Unlike" : "Like"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default MediaCard;

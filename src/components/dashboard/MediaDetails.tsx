import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import {
  Heart,
  Download,
  Share,
  Edit,
  Trash2,
  X,
  Image,
  Video,
  Tag,
  Calendar,
  Info,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface MediaDetailsProps {
  isOpen?: boolean;
  onClose?: () => void;
  media?: {
    id: string;
    type: "image" | "video";
    src: string;
    title: string;
    description: string;
    tags: string[];
    uploadDate: Date;
    liked: boolean;
  };
  onLike?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onEdit?: (id: string, data: any) => void;
  onDelete?: (id: string) => void;
}

const MediaDetails = ({
  isOpen = true,
  onClose = () => {},
  media = {
    id: "media-1",
    type: "image",
    src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    title: "Beautiful Sunset",
    description:
      "Captured this amazing sunset at the beach last weekend. The colors were absolutely breathtaking and I wanted to share this moment with everyone.",
    tags: ["nature", "sunset", "beach", "photography"],
    uploadDate: new Date(),
    liked: false,
  },
  onLike = () => {},
  onDownload = () => {},
  onShare = () => {},
  onEdit = () => {},
  onDelete = () => {},
}: MediaDetailsProps) => {
  const [isLiked, setIsLiked] = useState(media.liked);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: media.title,
    description: media.description,
    tags: media.tags.join(", "),
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(media.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updatedData = {
      ...media,
      title: editData.title,
      description: editData.description,
      tags: editData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };
    onEdit(media.id, updatedData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: media.title,
      description: media.description,
      tags: media.tags.join(", "),
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(media.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-gray-900">
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-black/20 hover:bg-black/40 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Media Preview */}
          <div className="relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center h-[50vh] md:h-[70vh] overflow-hidden">
            {media.type === "image" ? (
              <motion.img
                src={media.src}
                alt={media.title}
                className="max-h-full max-w-full object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <video
                  src={media.src}
                  controls
                  className="max-h-full max-w-full"
                />
              </div>
            )}
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                {media.type === "image" ? (
                  <Image className="h-3 w-3" />
                ) : (
                  <Video className="h-3 w-3" />
                )}
                {media.type === "image" ? "Image" : "Video"}
              </Badge>
            </div>
          </div>

          {/* Media Details */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={editData.tags}
                        onChange={(e) =>
                          setEditData({ ...editData, tags: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveEdit}>Save Changes</Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-2xl font-semibold">{media.title}</h2>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {media.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {media.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLike}
                            className="h-10 w-10"
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
                            onClick={() => onDownload(media.id)}
                            className="h-10 w-10"
                          >
                            <Download className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onShare(media.id)}
                            className="h-10 w-10"
                          >
                            <Share className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex space-x-2">
                    {!isEditing && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleEdit}
                                className="h-10 w-10"
                              >
                                <Edit className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                                className="h-10 w-10"
                              >
                                <Trash2 className="h-5 w-5 text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Uploaded on{" "}
                      {format(media.uploadDate, "MMMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {media.type === "image" ? "Image" : "Video"} file
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDetails;

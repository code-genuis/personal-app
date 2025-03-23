import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, X, Image, FileVideo, Check, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MediaFile {
  file: File;
  preview: string;
  type: "image" | "video";
}

interface UploadModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUploadComplete?: (
    files: File[],
    metadata: { title: string; description: string }[],
  ) => void;
}

const UploadModal = ({
  open = true,
  onOpenChange,
  onUploadComplete,
}: UploadModalProps) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles
      .map((file) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) return null;

        return {
          file,
          preview: URL.createObjectURL(file),
          type: isImage ? "image" : ("video" as "image" | "video"),
        };
      })
      .filter(Boolean) as MediaFile[];

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    maxSize: 100 * 1024 * 1024, // 100MB max size
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    // Simulate upload delay
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Call the onUploadComplete callback with files and metadata
      if (onUploadComplete) {
        const fileObjects = files.map((f) => f.file);
        const metadataArray = Array(files.length).fill({ title, description });
        onUploadComplete(fileObjects, metadataArray);
      }

      // Reset the form
      setFiles([]);
      setTitle("");
      setDescription("");
      setUploading(false);
      setUploadProgress(0);

      // Close the modal
      if (onOpenChange) onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upload Media</DialogTitle>
          <DialogDescription>
            Drag and drop your images or videos here, or click to browse.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                animate={{ y: isDragActive ? -10 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Upload className="h-12 w-12 text-gray-400" />
              </motion.div>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-gray-500">
                  Supports images and videos up to 100MB
                </p>
              </div>
              <Button variant="outline" type="button">
                Browse Files
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Selected Files ({files.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                      {file.type === "image" ? (
                        <img
                          src={file.preview}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <video
                            src={file.preview}
                            className="max-w-full max-h-full"
                            controls
                          />
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3 flex items-center space-x-2">
                      {file.type === "image" ? (
                        <Image className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileVideo className="h-4 w-4 text-purple-500" />
                      )}
                      <span className="text-sm truncate">{file.file.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a title for your media"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                rows={4}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          {uploading ? (
            <div className="w-full space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange && onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0}
                className="space-x-2"
              >
                {files.length === 0 ? (
                  "Select Files to Upload"
                ) : (
                  <>
                    <span>
                      Upload {files.length}{" "}
                      {files.length === 1 ? "File" : "Files"}
                    </span>
                    <Upload className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;

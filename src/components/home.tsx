import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Upload, User, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AuthModal from "./auth/AuthModal";
import MediaGrid from "./dashboard/MediaGrid";
import UploadModal from "./upload/UploadModal";
import ProfileSettings from "./profile/ProfileSettings";
import MediaDetails from "./dashboard/MediaDetails";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Mock user data
  const user = {
    displayName: "CodeGenius.Dev",
    email: "user@codegenius.dev",
    bio: "Personal media enthusiast and developer.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=codegenius",
  };

  // Mock media data
  const mediaItems = [
    {
      id: "media-1",
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
      title: "Colorful Abstract",
      description: "Vibrant abstract digital art with flowing colors.",
      liked: true,
      category: "Art",
      dateAdded: new Date(2023, 5, 15),
    },
    {
      id: "media-2",
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80",
      title: "Mountain Landscape",
      description: "Beautiful mountain range at sunset with dramatic clouds.",
      liked: false,
      category: "Nature",
      dateAdded: new Date(2023, 6, 22),
    },
    {
      id: "media-3",
      type: "video" as const,
      src: "https://example.com/sample-video.mp4",
      title: "Coding Tutorial",
      description: "Step-by-step guide to building a React component.",
      liked: false,
      category: "Education",
      dateAdded: new Date(2023, 7, 10),
    },
    {
      id: "media-4",
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
      title: "Ocean Waves",
      description: "Peaceful ocean waves crashing on a sandy beach at dawn.",
      liked: true,
      category: "Nature",
      dateAdded: new Date(2023, 8, 5),
    },
  ];

  // Get the selected media details
  const selectedMedia = selectedMediaId
    ? {
        ...mediaItems.find((item) => item.id === selectedMediaId),
        tags: ["nature", "photography", "landscape"],
        uploadDate: new Date(),
      }
    : null;

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update the document class
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Handle authentication
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthModalOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Handle media selection
  const handleSelectMedia = (id: string) => {
    setSelectedMediaId(id);
  };

  // Handle media actions
  const handleLikeMedia = (id: string) => {
    console.log(`Liked media: ${id}`);
  };

  const handleDownloadMedia = (id: string) => {
    console.log(`Downloaded media: ${id}`);
  };

  const handleEditMedia = (id: string, data: any) => {
    console.log(`Edited media: ${id}`, data);
  };

  const handleDeleteMedia = (id: string) => {
    console.log(`Deleted media: ${id}`);
    if (selectedMediaId === id) {
      setSelectedMediaId(null);
    }
  };

  // Handle upload completion
  const handleUploadComplete = (files: File[], metadata: any[]) => {
    console.log("Upload completed:", files, metadata);
    setUploadModalOpen(false);
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    // In a real app, this would check for an existing session
    const checkAuth = () => {
      // Simulate checking auth state
      const hasSession = localStorage.getItem("session");
      if (hasSession) {
        setIsAuthenticated(true);
      } else {
        setAuthModalOpen(true);
      }
    };

    checkAuth();
  }, []);

  // Apply dark mode on mount
  useEffect(() => {
    // Check user preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setDarkMode(prefersDark);

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CG</span>
            </div>
            <span className="font-bold text-lg dark:text-white">
              CodeGenius.Dev
            </span>
          </div>

          {/* Search Bar - Only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search your media..."
                  className="pl-10 w-full"
                />
              </div>
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            {isAuthenticated ? (
              <>
                {/* Upload button */}
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  className="hidden md:flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Button>

                {/* Mobile upload button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setUploadModalOpen(true)}
                  className="md:hidden rounded-full"
                >
                  <Upload className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.avatarUrl}
                          alt={user.displayName}
                        />
                        <AvatarFallback>CG</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setProfileSettingsOpen(true)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)}>Sign In</Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {isAuthenticated ? (
          <div className="space-y-6">
            {/* Dashboard Tabs */}
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Media</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>

                <Button
                  onClick={() => setUploadModalOpen(true)}
                  className="md:hidden flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
              </div>

              <TabsContent value="all" className="mt-0">
                <MediaGrid
                  items={mediaItems}
                  onSelectMedia={handleSelectMedia}
                  onLikeMedia={handleLikeMedia}
                  onDownloadMedia={handleDownloadMedia}
                  onEditMedia={handleEditMedia}
                  onDeleteMedia={handleDeleteMedia}
                />
              </TabsContent>

              <TabsContent value="images" className="mt-0">
                <MediaGrid
                  items={mediaItems.filter((item) => item.type === "image")}
                  onSelectMedia={handleSelectMedia}
                  onLikeMedia={handleLikeMedia}
                  onDownloadMedia={handleDownloadMedia}
                  onEditMedia={handleEditMedia}
                  onDeleteMedia={handleDeleteMedia}
                />
              </TabsContent>

              <TabsContent value="videos" className="mt-0">
                <MediaGrid
                  items={mediaItems.filter((item) => item.type === "video")}
                  onSelectMedia={handleSelectMedia}
                  onLikeMedia={handleLikeMedia}
                  onDownloadMedia={handleDownloadMedia}
                  onEditMedia={handleEditMedia}
                  onDeleteMedia={handleDeleteMedia}
                />
              </TabsContent>

              <TabsContent value="favorites" className="mt-0">
                <MediaGrid
                  items={mediaItems.filter((item) => item.liked)}
                  onSelectMedia={handleSelectMedia}
                  onLikeMedia={handleLikeMedia}
                  onDownloadMedia={handleDownloadMedia}
                  onEditMedia={handleEditMedia}
                  onDeleteMedia={handleDeleteMedia}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">CG</span>
              </div>
              <h1 className="text-3xl font-bold dark:text-white">
                Welcome to CodeGenius.Dev
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your personal media management platform. Sign in to upload,
                organize, and interact with your images and videos.
              </p>
              <Button
                size="lg"
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-6"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} CodeGenius.Dev. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        {uploadModalOpen && (
          <UploadModal
            open={uploadModalOpen}
            onOpenChange={setUploadModalOpen}
            onUploadComplete={handleUploadComplete}
          />
        )}

        {profileSettingsOpen && (
          <ProfileSettings
            isOpen={profileSettingsOpen}
            onClose={() => setProfileSettingsOpen(false)}
            user={user}
            darkMode={darkMode}
            onDarkModeChange={toggleDarkMode}
          />
        )}

        {selectedMediaId && selectedMedia && (
          <MediaDetails
            isOpen={!!selectedMediaId}
            onClose={() => setSelectedMediaId(null)}
            media={selectedMedia as any}
            onLike={handleLikeMedia}
            onDownload={handleDownloadMedia}
            onEdit={handleEditMedia}
            onDelete={handleDeleteMedia}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Upload, Moon, Sun, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  isDarkMode?: boolean;
  onDarkModeToggle?: () => void;
  isAuthenticated?: boolean;
  userProfile?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onUploadClick?: () => void;
  onNotificationsClick?: () => void;
}

const Header = ({
  isDarkMode = false,
  onDarkModeToggle = () => {},
  isAuthenticated = false,
  userProfile = {
    name: "CodeGenius.Dev",
    email: "user@codegenius.dev",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=codegenius",
  },
  onUploadClick = () => {},
  onNotificationsClick = () => {},
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">CodeGenius.Dev</span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex md:flex-1 md:max-w-md md:mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search media..."
              className="w-full pl-8"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onNotificationsClick}
                      className="relative"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onUploadClick}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload new media</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={onDarkModeToggle}
                        />
                        {isDarkMode ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle dark mode</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src={userProfile.avatarUrl}
                        alt={userProfile.name}
                      />
                      <AvatarFallback>
                        {userProfile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{userProfile.name}</DropdownMenuLabel>
                  <DropdownMenuItem className="text-xs text-muted-foreground">
                    {userProfile.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/logout" className="w-full">
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => console.log("Open auth modal")}>
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b p-4 md:hidden">
            <div className="space-y-4">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search media..."
                  className="w-full pl-8"
                />
              </div>

              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage
                          src={userProfile.avatarUrl}
                          alt={userProfile.name}
                        />
                        <AvatarFallback>
                          {userProfile.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {userProfile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userProfile.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={onDarkModeToggle}
                      />
                      {isDarkMode ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={onUploadClick}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/logout"
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      Logout
                    </Link>
                  </div>
                </>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => console.log("Open auth modal")}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

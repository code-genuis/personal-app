import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { User, Save, Moon, Sun, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not exceed 160 characters.",
    })
    .optional(),
});

interface ProfileSettingsProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: {
    displayName: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
  };
  darkMode?: boolean;
  onDarkModeChange?: (enabled: boolean) => void;
}

const ProfileSettings = ({
  isOpen = true,
  onClose = () => {},
  user = {
    displayName: "CodeGenius.Dev",
    email: "user@codegenius.dev",
    bio: "Personal media enthusiast and developer.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=codegenius",
  },
  darkMode = false,
  onDarkModeChange = () => {},
}: ProfileSettingsProps) => {
  const [avatarUploadOpen, setAvatarUploadOpen] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: user.displayName,
      email: user.email,
      bio: user.bio || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would save the profile data
    console.log("Profile updated:", values);
    onClose();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAvatar = () => {
    // In a real app, this would upload the avatar
    setAvatarUploadOpen(false);
  };

  return (
    <div className="bg-background w-full h-full">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Profile Settings
            </DialogTitle>
            <DialogDescription>
              Update your CodeGenius.Dev profile information and preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-6 py-4">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <Avatar
                  className="h-24 w-24 cursor-pointer"
                  onClick={() => setAvatarUploadOpen(true)}
                >
                  <AvatarImage
                    src={previewAvatar || user.avatarUrl}
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-primary/10">
                    <User className="h-12 w-12 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute bottom-0 right-0 bg-primary rounded-full p-1 shadow-md cursor-pointer"
                  onClick={() => setAvatarUploadOpen(true)}
                >
                  <Upload className="h-4 w-4 text-primary-foreground" />
                </div>
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Click to change profile picture
              </p>
            </div>

            {/* Profile Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name on CodeGenius.Dev.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your email address is used for notifications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tell us about yourself"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short bio about yourself (max 160 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={darkMode}
                      onCheckedChange={onDarkModeChange}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button variant="outline" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Avatar Upload Dialog */}
      <Dialog open={avatarUploadOpen} onOpenChange={setAvatarUploadOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture for your CodeGenius.Dev account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {previewAvatar && (
              <div className="flex justify-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={previewAvatar} alt="Preview" />
                  <AvatarFallback>
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAvatarUploadOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveAvatar} disabled={!previewAvatar}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;

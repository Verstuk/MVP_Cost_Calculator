"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

interface AvatarUploadProps {
  userId: string;
  initialAvatarUrl?: string;
  userInitials: string;
}

export default function AvatarUpload({
  userId,
  initialAvatarUrl,
  userInitials,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    initialAvatarUrl,
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setError(null);
      setSuccess(false);
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        setError("You must select an image to upload.");
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        setUploading(false);
        return;
      }

      // Check file type
      if (
        !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type,
        )
      ) {
        setError("File must be an image (JPEG, PNG, GIF, or WEBP)");
        setUploading(false);
        return;
      }

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const newAvatarUrl = publicUrlData.publicUrl;

      // Update user profile with avatar URL
      const formData = new FormData();
      formData.append("avatarUrl", newAvatarUrl);

      const response = await fetch("/api/update-profile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      setAvatarUrl(newAvatarUrl);
      setSuccess(true);
      router.refresh();
    } catch (error: any) {
      setError(error.message || "An error occurred while uploading the avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} alt="Profile picture" />
        <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center">
        <Label
          htmlFor="avatar"
          className="cursor-pointer flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Avatar"}
        </Label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-500">Avatar updated successfully!</p>
      )}
    </div>
  );
}

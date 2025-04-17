"use client";

import { useRef, useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface AvatarUploadProps {
  userId: string;
  initialAvatarUrl?: string;
  userInitials: string;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
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

  // Image cropping states
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);

    if (!e.target.files || e.target.files.length === 0) {
      setError("You must select an image to upload.");
      return;
    }

    const file = e.target.files[0];
    setSelectedFile(file);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Accept any image type
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result?.toString() || "");
      setCropDialogOpen(true);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: PixelCrop,
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95,
      );
    });
  };

  const uploadCroppedImage = async () => {
    try {
      if (!imgRef.current || !completedCrop || !selectedFile) {
        return;
      }

      setUploading(true);
      setCropDialogOpen(false);

      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop,
      );

      // Create a new file from the blob
      const fileExt = "jpeg"; // We're converting to JPEG in the getCroppedImg function
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const croppedFile = new File([croppedImageBlob], fileName, {
        type: "image/jpeg",
      });

      const filePath = `${userId}/avatar.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, croppedFile, { upsert: true });

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
          onChange={onSelectFile}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-500">Avatar updated successfully!</p>
      )}

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Avatar</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col items-center">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop me"
                  onLoad={onImageLoad}
                  className="max-h-[400px] max-w-full"
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCropDialogOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={uploadCroppedImage}
              disabled={!completedCrop || uploading}
            >
              {uploading ? "Uploading..." : "Save Avatar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

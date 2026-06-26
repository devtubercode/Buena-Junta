import { useEffect, useState } from "react";

interface UseAdminImageUploadReturn {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  shouldRemoveImage: boolean;
  setSelectedImageFile: (file: File | null) => void;
  removeImage: () => void;
  resetImageState: () => void;
}

export function useAdminImageUpload(): UseAdminImageUploadReturn {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);

  useEffect(
    () => () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    },
    [imagePreviewUrl],
  );

  const setSelectedImageFile = (file: File | null) => {
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return file ? URL.createObjectURL(file) : null;
    });
    setImageFile(file);
    setShouldRemoveImage(false);
  };

  const removeImage = () => {
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return null;
    });
    setImageFile(null);
    setShouldRemoveImage(true);
  };

  const resetImageState = () => {
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return null;
    });
    setImageFile(null);
    setShouldRemoveImage(false);
  };

  return {
    imageFile,
    imagePreviewUrl,
    shouldRemoveImage,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  };
}

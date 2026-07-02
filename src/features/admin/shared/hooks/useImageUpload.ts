import { useCallback, useState } from "react";

export type ImageUploadAction = "keep" | "replace" | "remove";

interface UseImageUploadReturn {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  imageAction: ImageUploadAction;
  setSelectedImageFile: (file: File | null) => void;
  removeImage: () => void;
  resetImageState: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageAction, setImageAction] = useState<ImageUploadAction>("keep");

  const setSelectedImageFile = useCallback((file: File | null) => {
    if (!file) return;

    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return URL.createObjectURL(file);
    });
    setImageFile(file);
    setImageAction("replace");
  }, []);

  const removeImage = useCallback(() => {
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return null;
    });
    setImageFile(null);
    setImageAction("remove");
  }, []);

  const resetImageState = useCallback(() => {
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return null;
    });
    setImageFile(null);
    setImageAction("keep");
  }, []);

  return {
    imageFile,
    imagePreviewUrl,
    imageAction,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  };
};

import { useState } from "react";
import { notify } from "@/shared/notifications/notify";

interface UseAdminSaveHandlerOptions<T> {
  successMessage?: string;
  onSuccess?: (result: T) => void | Promise<void>;
}

interface UseAdminSaveHandlerReturn<T> {
  isSaving: boolean;
  execute: (saveFn: () => Promise<T>) => Promise<void>;
}

export const useSaveHandler = <T>({
  successMessage,
  onSuccess,
}: UseAdminSaveHandlerOptions<T> = {}): UseAdminSaveHandlerReturn<T> => {
  const [isSaving, setIsSaving] = useState(false);

  const execute = async (saveFn: () => Promise<T>) => {
    setIsSaving(true);

    try {
      const result = await saveFn();

      if (successMessage) {
        notify.success(successMessage);
      }

      await onSuccess?.(result);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    execute,
  };
};

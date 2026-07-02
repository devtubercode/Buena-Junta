import { supabase } from "@/lib/supabase/client";
import { throwIfSupabaseError } from "@/shared/errors/handle-supabase-error";

export type StoragePath = string;

function getStoragePath(file: File, pathPrefix: string): StoragePath {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "webp";
  const safeName = `${crypto.randomUUID()}.${extension}`;

  return `${pathPrefix}/${safeName}`;
}

export async function uploadStorageImage(
  file: File,
  bucket: string,
  pathPrefix: string,
): Promise<StoragePath> {
  const storagePath = getStoragePath(file, pathPrefix);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file);

  throwIfSupabaseError(error);

  return storagePath;
}

export async function removeStorageImage(
  storagePath: StoragePath,
  bucket: string,
) {
  const { error } = await supabase.storage.from(bucket).remove([storagePath]);

  throwIfSupabaseError(error);
}

export function getStorageImageUrl(
  storagePath: StoragePath,
  bucket: string,
): string {
  return supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
}

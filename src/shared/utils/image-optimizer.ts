/**
 * Client-side image optimizer.
 *
 * Resizes and compresses images in the browser before uploading them to
 * Supabase Storage. Keeps EXIF orientation intact using a tiny inline EXIF
 * reader, so photos uploaded from mobile devices render correctly.
 *
 * Browser-native APIs only — no extra dependencies.
 */

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

export interface OptimizeImageOptions {
  /** Maximum width in pixels. Defaults to 1200. */
  maxWidth?: number;
  /** Maximum height in pixels. Defaults to 1200. */
  maxHeight?: number;
  /** Compression quality for lossy formats (0–1). Defaults to 0.8. */
  quality?: number;
  /** Preferred output MIME type. Defaults to image/webp. */
  outputType?: "image/webp" | "image/jpeg";
}

export const DEFAULT_OPTIMIZE_OPTIONS: Required<
  Pick<OptimizeImageOptions, "maxWidth" | "maxHeight" | "quality" | "outputType">
> = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  outputType: "image/webp",
};

function isSupportedImageType(type: string): type is SupportedImageType {
  return SUPPORTED_IMAGE_TYPES.includes(type as SupportedImageType);
}

function readUint16(view: DataView, offset: number, littleEndian: boolean): number {
  return view.getUint16(offset, littleEndian);
}

function readUint32(view: DataView, offset: number, littleEndian: boolean): number {
  return view.getUint32(offset, littleEndian);
}

/**
 * Minimal EXIF orientation reader. Scans the first APP1 segment of a JPEG
 * and returns the Orientation tag value (1–8). Returns 1 for non-JPEG files
 * or when no orientation tag is found.
 */
async function readExifOrientation(file: File): Promise<number> {
  if (file.type !== "image/jpeg") return 1;

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const view = new DataView(buffer);
      const orientation = findExifOrientation(view);
      resolve(orientation);
    };

    reader.onerror = () => resolve(1);
    // The EXIF segment is usually within the first few KB.
    reader.readAsArrayBuffer(file.slice(0, 65536));
  });
}

function findExifOrientation(view: DataView): number {
  if (view.byteLength < 2 || view.getUint16(0, false) !== 0xffd8) {
    return 1;
  }

  let offset = 2;
  while (offset < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) {
      offset++;
      continue;
    }

    const marker = view.getUint16(offset, false);
    // End of image or start of scan stream — no more metadata.
    if (marker === 0xffd9 || marker === 0xffda) break;

    const length = view.getUint16(offset + 2, false);
    if (length < 2 || offset + 2 + length > view.byteLength) break;

    if (marker === 0xffe1 && length > 8) {
      const identifier = String.fromCharCode(
        view.getUint8(offset + 4),
        view.getUint8(offset + 5),
        view.getUint8(offset + 6),
        view.getUint8(offset + 7),
        view.getUint8(offset + 8),
        view.getUint8(offset + 9),
      );

      if (identifier === "Exif\0\0") {
        const tiffHeader = offset + 10;
        if (tiffHeader + 8 > view.byteLength) break;

        const byteOrder = view.getUint16(tiffHeader, false);
        const littleEndian = byteOrder === 0x4949; // "II"
        const ifdOffset = readUint32(view, tiffHeader + 4, littleEndian);
        const ifd = tiffHeader + ifdOffset;

        if (ifd + 2 > view.byteLength) break;
        const entries = readUint16(view, ifd, littleEndian);

        for (let i = 0; i < entries; i++) {
          const entry = ifd + 2 + i * 12;
          if (entry + 12 > view.byteLength) break;

          const tag = readUint16(view, entry, littleEndian);
          if (tag === 0x0112) {
            return readUint16(view, entry + 8, littleEndian);
          }
        }
      }
    }

    offset += 2 + length;
  }

  return 1;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo cargar la imagen para optimizarla."));
    };

    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function applyOrientation(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  orientation: number,
): void {
  context.translate(width / 2, height / 2);

  switch (orientation) {
    case 2:
      context.scale(-1, 1);
      break;
    case 3:
      context.rotate(Math.PI);
      break;
    case 4:
      context.scale(1, -1);
      break;
    case 5:
      context.rotate(Math.PI / 2);
      context.scale(1, -1);
      break;
    case 6:
      context.rotate(Math.PI / 2);
      break;
    case 7:
      context.rotate(Math.PI / 2);
      context.scale(-1, 1);
      break;
    case 8:
      context.rotate(-Math.PI / 2);
      break;
    default:
      // Orientation 1: no transformation needed.
      break;
  }
}

/**
 * Resizes and compresses an image file client-side.
 *
 * @param file Original image file (JPEG, PNG or WebP).
 * @param options Optimization options.
 * @returns A new File ready for upload (WebP by default, JPEG fallback).
 */
export async function createOptimizedImageFile(
  file: File,
  options: OptimizeImageOptions = {},
): Promise<File> {
  if (!isSupportedImageType(file.type)) {
    throw new Error(
      `Formato de imagen no soportado: ${file.type}. Usa JPEG, PNG o WebP.`,
    );
  }

  const maxWidth = options.maxWidth ?? DEFAULT_OPTIMIZE_OPTIONS.maxWidth;
  const maxHeight = options.maxHeight ?? DEFAULT_OPTIMIZE_OPTIONS.maxHeight;
  const quality = options.quality ?? DEFAULT_OPTIMIZE_OPTIONS.quality;
  let outputType = options.outputType ?? DEFAULT_OPTIMIZE_OPTIONS.outputType;

  const [image, orientation] = await Promise.all([
    loadImageFromFile(file),
    readExifOrientation(file),
  ]);

  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;

  // Orientation values 5-8 imply a 90-degree rotation; swap dimensions.
  if (orientation >= 5) {
    [sourceWidth, sourceHeight] = [sourceHeight, sourceWidth];
  }

  const scale = Math.min(
    1,
    maxWidth / sourceWidth,
    maxHeight / sourceHeight,
  );

  const drawWidth = Math.round(sourceWidth * scale);
  const drawHeight = Math.round(sourceHeight * scale);

  // The canvas size matches the rotated drawing dimensions.
  const canvasWidth = orientation >= 5 ? drawHeight : drawWidth;
  const canvasHeight = orientation >= 5 ? drawWidth : drawHeight;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("No se pudo crear el contexto de canvas.");
  }

  applyOrientation(context, canvasWidth, canvasHeight, orientation);
  context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

  let blob = await canvasToBlob(canvas, outputType, quality);

  // Fallback to JPEG when the browser does not support WebP encoding.
  if (outputType === "image/webp" && (!blob || blob.type !== "image/webp")) {
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
    outputType = "image/jpeg";
  }

  if (!blob || blob.size === 0) {
    throw new Error("No se pudo generar la imagen optimizada.");
  }

  const baseName = file.name.replace(/\.[^.]+$/, "");
  const extension = outputType === "image/webp" ? "webp" : "jpg";
  const optimizedName = `${baseName}.${extension}`;

  return new File([blob], optimizedName, { type: outputType });
}

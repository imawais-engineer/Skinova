export type ImageValidationResult =
  | { ok: true; width: number; height: number }
  | { ok: false; message: string };

const MAX_BYTES = 10 * 1024 * 1024;
const MIN_SHORT_SIDE = 480;

export function validateImageFile(file: File): Promise<ImageValidationResult> {
  if (!file.type.match(/^image\/(jpeg|jpg|png)$/i) && !file.name.match(/\.(jpe?g|png)$/i)) {
    return Promise.resolve({
      ok: false,
      message: "Use a JPG or PNG photo. HEIC and other formats are not supported."
    });
  }

  if (file.size > MAX_BYTES) {
    return Promise.resolve({
      ok: false,
      message: "Image is too large. Use a photo under 10MB."
    });
  }

  if (file.size < 8_000) {
    return Promise.resolve({
      ok: false,
      message: "Image file looks too small. Choose a higher-resolution selfie."
    });
  }

  return readImageDimensions(file).then((dimensions) => {
    if (!dimensions) {
      return {
        ok: false,
        message: "Could not read this image. Try another JPG or PNG file."
      };
    }

    const shortSide = Math.min(dimensions.width, dimensions.height);
    if (shortSide < MIN_SHORT_SIDE) {
      return {
        ok: false,
        message: `Image resolution is too low (${dimensions.width}×${dimensions.height}). The short side should be at least ${MIN_SHORT_SIDE}px.`
      };
    }

    return { ok: true, width: dimensions.width, height: dimensions.height };
  });
}

function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    image.src = url;
  });
}

export function validateImageBuffer(
  buffer: ArrayBuffer,
  fileName: string
): ImageValidationResult {
  const dimensions = getBufferImageDimensions(buffer);

  if (!dimensions) {
    return { ok: false, message: "Could not read this image. Use a JPG or PNG selfie." };
  }

  const shortSide = Math.min(dimensions.width, dimensions.height);
  if (shortSide < MIN_SHORT_SIDE) {
    return {
      ok: false,
      message: `Image resolution is too low (${dimensions.width}×${dimensions.height}). Use a closer, higher-quality selfie.`
    };
  }

  if (buffer.byteLength > MAX_BYTES) {
    return { ok: false, message: "Image is too large. Use a photo under 10MB." };
  }

  if (!fileName.match(/\.(jpe?g|png)$/i)) {
    return { ok: false, message: "Use a JPG or PNG photo." };
  }

  return { ok: true, width: dimensions.width, height: dimensions.height };
}

function getBufferImageDimensions(buffer: ArrayBuffer): { width: number; height: number } | null {
  const bytes = new Uint8Array(buffer);

  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    return getJpegDimensions(bytes);
  }

  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
    const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
    return width > 0 && height > 0 ? { width, height } : null;
  }

  return null;
}

function getJpegDimensions(bytes: Uint8Array) {
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      break;
    }

    const marker = bytes[offset + 1];
    const length = (bytes[offset + 2] << 8) + bytes[offset + 3];

    if (marker === 0xc0 || marker === 0xc2) {
      const height = (bytes[offset + 5] << 8) + bytes[offset + 6];
      const width = (bytes[offset + 7] << 8) + bytes[offset + 8];
      return width > 0 && height > 0 ? { width, height } : null;
    }

    offset += length + 2;
  }

  return null;
}

export function normalizeImageContentType(fileName: string, reportedType?: string) {
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".png")) {
    return "image/png";
  }

  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (reportedType?.includes("png")) {
    return "image/png";
  }

  return "image/jpeg";
}

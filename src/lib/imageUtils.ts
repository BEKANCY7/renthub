// Image upload utilities

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: "Image must be smaller than 5MB" };
  }

  // Check for supported formats
  const supportedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: "Supported formats: JPEG, PNG, WebP" };
  }

  return { valid: true };
}

export function validateImageFiles(files: File[]): ImageValidationResult {
  // Check total number of files
  if (files.length > 10) {
    return { valid: false, error: "Maximum 10 images allowed" };
  }

  // Validate each file
  for (const file of files) {
    const result = validateImageFile(file);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

export function filterValidUrls(urls: string[]): string[] {
  return urls.filter(isValidUrl);
}

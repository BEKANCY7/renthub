/**
 * @jest-environment jsdom
 */
import {
  validateImageFile,
  validateImageFiles,
  formatFileSize,
  isValidUrl,
  filterValidUrls,
} from "../imageUtils";

function makeFile(
  name: string,
  type: string,
  sizeBytes: number
): File {
  const content = new Uint8Array(sizeBytes);
  return new File([content], name, { type });
}

describe("validateImageFile", () => {
  it("accepts a valid JPEG under 5MB", () => {
    const file = makeFile("photo.jpg", "image/jpeg", 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it("accepts PNG and WebP", () => {
    expect(
      validateImageFile(makeFile("a.png", "image/png", 1024))
    ).toEqual({ valid: true });
    expect(
      validateImageFile(makeFile("a.webp", "image/webp", 1024))
    ).toEqual({ valid: true });
  });

  it("rejects non-image files", () => {
    const file = makeFile("doc.pdf", "application/pdf", 1024);
    expect(validateImageFile(file)).toEqual({
      valid: false,
      error: "File must be an image",
    });
  });

  it("rejects image files larger than 5MB", () => {
    const file = makeFile("big.jpg", "image/jpeg", 5 * 1024 * 1024 + 1);
    expect(validateImageFile(file)).toEqual({
      valid: false,
      error: "Image must be smaller than 5MB",
    });
  });

  it("rejects unsupported image formats like GIF", () => {
    const file = makeFile("anim.gif", "image/gif", 1024);
    expect(validateImageFile(file)).toEqual({
      valid: false,
      error: "Supported formats: JPEG, PNG, WebP",
    });
  });

  it("accepts files exactly at the 5MB boundary", () => {
    const file = makeFile("edge.jpg", "image/jpeg", 5 * 1024 * 1024);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });
});

describe("validateImageFiles", () => {
  it("accepts an empty list", () => {
    expect(validateImageFiles([])).toEqual({ valid: true });
  });

  it("accepts a list of valid images", () => {
    const files = [
      makeFile("a.jpg", "image/jpeg", 100),
      makeFile("b.png", "image/png", 200),
    ];
    expect(validateImageFiles(files)).toEqual({ valid: true });
  });

  it("rejects when more than 10 files are provided", () => {
    const files = Array.from({ length: 11 }, (_, i) =>
      makeFile(`f${i}.jpg`, "image/jpeg", 100)
    );
    expect(validateImageFiles(files)).toEqual({
      valid: false,
      error: "Maximum 10 images allowed",
    });
  });

  it("accepts exactly 10 files", () => {
    const files = Array.from({ length: 10 }, (_, i) =>
      makeFile(`f${i}.jpg`, "image/jpeg", 100)
    );
    expect(validateImageFiles(files)).toEqual({ valid: true });
  });

  it("returns the first invalid file's error", () => {
    const files = [
      makeFile("ok.jpg", "image/jpeg", 100),
      makeFile("bad.pdf", "application/pdf", 100),
      makeFile("ok2.png", "image/png", 100),
    ];
    expect(validateImageFiles(files)).toEqual({
      valid: false,
      error: "File must be an image",
    });
  });
});

describe("formatFileSize", () => {
  it("returns '0 Bytes' for 0", () => {
    expect(formatFileSize(0)).toBe("0 Bytes");
  });

  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 Bytes");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1 MB");
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });

  it("formats gigabytes", () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 GB");
  });
});

describe("isValidUrl", () => {
  it("accepts http URLs", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  it("accepts https URLs", () => {
    expect(isValidUrl("https://example.com/path?q=1")).toBe(true);
  });

  it("rejects non-http(s) schemes", () => {
    expect(isValidUrl("ftp://example.com")).toBe(false);
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("file:///etc/passwd")).toBe(false);
  });

  it("rejects malformed URLs", () => {
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("")).toBe(false);
  });
});

describe("filterValidUrls", () => {
  it("keeps only valid http(s) URLs", () => {
    const input = [
      "https://example.com",
      "not-a-url",
      "http://foo.bar",
      "javascript:alert(1)",
    ];
    expect(filterValidUrls(input)).toEqual([
      "https://example.com",
      "http://foo.bar",
    ]);
  });

  it("returns empty array for all-invalid input", () => {
    expect(filterValidUrls(["", "nope", "mailto:a@b.c"])).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(filterValidUrls([])).toEqual([]);
  });
});

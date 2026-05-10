import { describe, it, expect } from "vitest";
import { sanitizeHTML } from "@/lib/sanitize";

describe("sanitizeHTML", () => {
  it("should strip script tags", () => {
    const result = sanitizeHTML('<script>alert("xss")</script>');
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
  });

  it("should strip event handlers", () => {
    const result = sanitizeHTML('<img src="x" onerror="alert(1)">');
    // Server-side strips all tags
    expect(result).not.toContain("onerror");
    expect(result).not.toContain("alert");
  });

  it("should preserve safe HTML in browser", () => {
    const result = sanitizeHTML("<p>Hello <strong>World</strong></p>");
    expect(result).toContain("Hello");
    expect(result).toContain("World");
  });

  it("should handle empty string", () => {
    expect(sanitizeHTML("")).toBe("");
  });

  it("should handle plain text", () => {
    expect(sanitizeHTML("Just plain text")).toBe("Just plain text");
  });
});

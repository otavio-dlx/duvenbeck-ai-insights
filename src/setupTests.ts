import "@testing-library/jest-dom";
import { URL, URLSearchParams } from "node:url";
import { vi } from "vitest";

// Mock PointerEvent methods for Radix UI components in JSDOM
if (globalThis.window !== undefined) {
  globalThis.window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  globalThis.window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  globalThis.window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// Polyfill for URL and related APIs that webidl-conversions expects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.URL ??= URL as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.URLSearchParams ??= URLSearchParams as any;

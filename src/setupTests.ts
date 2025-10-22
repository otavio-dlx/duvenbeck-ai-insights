/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { URL, URLSearchParams } from "node:url";
import { vi } from "vitest";

// Mock PointerEvent methods for Radix UI components in JSDOM
if (globalThis.window !== undefined) {
  globalThis.window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  globalThis.window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  globalThis.window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// Comprehensive URL and Web API polyfills for webidl-conversions and whatwg-url
// These packages expect certain globals to be available
globalThis.URL ??= URL as any;
globalThis.URLSearchParams ??= URLSearchParams as any;

// Additional globals that webidl-conversions might expect
globalThis.DOMException ??= class DOMException extends Error {
  constructor(message?: string, name?: string) {
    super(message);
    this.name = name || "DOMException";
  }
} as any;

// Ensure crypto.getRandomValues is available (needed by some URL parsing libs)
if (!globalThis.crypto) {
  globalThis.crypto = {
    getRandomValues: (array: any) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
  } as any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

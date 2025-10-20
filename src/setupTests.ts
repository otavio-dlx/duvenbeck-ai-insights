import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock PointerEvent methods for Radix UI components in JSDOM
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}
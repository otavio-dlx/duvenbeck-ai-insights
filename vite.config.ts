/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import path from "node:path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) {
            // Department data files in separate chunks
            if (
              id.includes("/src/data/") &&
              id.endsWith(".ts") &&
              !id.includes("types.ts")
            ) {
              return "departments";
            }
            return;
          }

          // Vendor libraries mapping
          const vendorChunks = {
            react: "vendor",
            "react-dom": "vendor",
            "@radix-ui": "ui",
            recharts: "charts",
            "react-i18next": "i18n",
            i18next: "i18n",
            "react-router-dom": "routing",
            "@tanstack/react-query": "data",
            "@google/generative-ai": "ai",
            "@qdrant/js-client-rest": "ai",
          };

          for (const [pkg, chunk] of Object.entries(vendorChunks)) {
            if (id.includes(pkg)) return chunk;
          }

          return "vendor";
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: "esnext",
    minify: "esbuild",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

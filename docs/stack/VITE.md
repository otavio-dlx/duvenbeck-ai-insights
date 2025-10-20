# Vite - Next Generation Frontend Tooling

Vite is a modern build tool that provides lightning-fast development experience through native ES modules and highly optimized production builds via Rollup. It consists of two major components: a development server with instant server start and Hot Module Replacement (HMR), and a build command that bundles code for production. Vite's dev server serves source files over native ES modules, eliminating the need for bundling during development and enabling sub-second server startup regardless of application size.

The framework-agnostic architecture makes Vite extensible through a powerful plugin system compatible with Rollup plugins, offering full TypeScript support throughout its JavaScript API and plugin interface. Vite supports all major frontend frameworks including Vue, React, Svelte, and Solid, while providing rich built-in features like TypeScript transpilation, JSX support, CSS preprocessing, and asset handling out of the box.

## APIs and Key Functions

### Create Development Server

Programmatically create and start a Vite development server with custom configuration.

```js
import { createServer } from 'vite'

// Create development server with custom configuration
const server = await createServer({
  root: process.cwd(),
  server: {
    port: 3000,
    strictPort: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [],
  optimizeDeps: {
    include: ['lodash-es']
  }
})

// Start listening on the configured port
await server.listen()

// Print server URLs to console
server.printUrls()

// Bind keyboard shortcuts for CLI interaction
server.bindCLIShortcuts({ print: true })

// Transform a URL programmatically (bypassing HTTP pipeline)
const result = await server.transformRequest('/src/main.js')
console.log(result.code) // Transformed JavaScript code

// Trigger HMR for a specific module
const module = server.moduleGraph.getModuleById('/src/components/App.vue')
if (module) {
  await server.reloadModule(module)
}

// Cleanup: close server when done
await server.close()
```

### Build for Production

Execute production build with custom configuration and output options.

```js
import { build } from 'vite'
import path from 'node:path'

// Single build configuration
const output = await build({
  root: path.resolve(__dirname, './src'),
  base: '/my-app/',
  build: {
    outDir: path.resolve(__dirname, './dist'),
    assetsDir: 'static',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html')
      },
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
})

// Multi-build for different environments (client + SSR)
const clientBuild = build({
  build: {
    outDir: 'dist/client',
    manifest: true
  }
})

const ssrBuild = build({
  build: {
    outDir: 'dist/server',
    ssr: 'src/entry-server.js',
    rollupOptions: {
      output: {
        format: 'esm'
      }
    }
  }
})

await Promise.all([clientBuild, ssrBuild])
```

### Preview Production Build

Start a local server to preview production build output.

```js
import { preview } from 'vite'

const previewServer = await preview({
  preview: {
    port: 8080,
    open: true,
    strictPort: false,
    cors: true,
    headers: {
      'Cache-Control': 'public, max-age=3600'
    },
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'dist'
  }
})

previewServer.printUrls()
previewServer.bindCLIShortcuts({ print: true })

// Preview server runs until manually closed
// Access at http://localhost:8080
```

### Define Configuration

Create type-safe Vite configuration with IntelliSense support.

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    },
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      overlay: true
    }
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1000
  }
})

// Conditional configuration based on command and mode
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      server: { port: 3000 }
    }
  } else {
    return {
      plugins: [react()],
      build: { minify: 'terser' }
    }
  }
})
```

### Load Environment Variables

Load environment variables from .env files for use in configuration.

```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load all env variables (not just VITE_ prefixed)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      __APP_VERSION__: JSON.stringify(env.APP_VERSION),
      __API_URL__: JSON.stringify(env.API_URL),
    },
    server: {
      port: env.PORT ? Number(env.PORT) : 5173,
      proxy: {
        '/api': {
          target: env.API_BASE_URL,
          changeOrigin: true
        }
      }
    }
  }
})

// In application code, VITE_ prefixed vars are auto-loaded
// .env.local:
// VITE_API_KEY=abc123
// VITE_FEATURE_FLAG=true

// src/main.js:
console.log(import.meta.env.VITE_API_KEY) // 'abc123'
console.log(import.meta.env.MODE) // 'development' or 'production'
```

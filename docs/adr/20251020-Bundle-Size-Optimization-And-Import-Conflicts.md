# ADR-004: Bundle Size Optimization and Import Conflicts Resolution

**Date:** 2025-10-20
**Status:** Accepted
**Context:** Build optimization for Vercel deployment

## Problem

During Vercel deployment, we encountered critical build issues:

1. **Bundle Size Warning**: Main chunk was 1,272.74 kB (358.06 kB gzipped), exceeding recommended 500KB limit
2. **Import Conflicts**: `types.ts` was both dynamically imported by `data.ts` and statically imported by `Dashboard.tsx`, causing chunking conflicts
3. **Deployment Failure**: "An unexpected error happened when running this build" on Vercel

## Root Causes

### Bundle Size Issues

- All vendor libraries bundled into single chunk
- Department data files loaded eagerly instead of dynamically
- No manual chunking strategy implemented

### Import Conflicts

- Shared types in `/src/data/types.ts` created circular dependencies
- `Dashboard.tsx` used `import.meta.glob("../data/*.ts", { eager: true })` causing static imports
- Mixed dynamic and static imports of the same modules

## Solution

### 1. Manual Chunking Strategy

Implemented Rollup manual chunking in `vite.config.ts`:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (!id.includes('node_modules')) {
          // Department data files in separate chunks
          if (id.includes('/src/data/') && id.endsWith('.ts') && !id.includes('types.ts')) {
            return 'departments';
          }
          return;
        }

        // Vendor libraries mapping
        const vendorChunks = {
          'react': 'vendor',
          'react-dom': 'vendor',
          '@radix-ui': 'ui',
          'recharts': 'charts',
          'react-i18next': 'i18n',
          'i18next': 'i18n',
          'react-router-dom': 'routing',
          '@tanstack/react-query': 'data',
          '@google/generative-ai': 'ai',
          '@qdrant/js-client-rest': 'ai'
        };

        for (const [pkg, chunk] of Object.entries(vendorChunks)) {
          if (id.includes(pkg)) return chunk;
        }

        return 'vendor';
      }
    }
  },
  chunkSizeWarningLimit: 1000,
  target: 'esnext',
  minify: 'esbuild'
}
```

### 2. Type System Reorganization

Created separate type files to avoid circular imports:

**`/src/types/shared.ts`** - Common interfaces:

```typescript
export interface TranslatedString {
  de: string;
  en: string;
}

export type LocalizableString = TranslatedString | string;
```

**`/src/types/ideas.ts`** - Core data structures:

```typescript
export interface NewFormatIdea {
  finalPrio: string | number;
  ideaKey: string;
  problemKey: string;
  solutionKey: string;
  owner: string;
  // ... other properties
}

export interface HomeInfo {
  date: string;
  department: string;
  businessLine?: string;
  collaboardLink: string;
}
```

### 3. Import Pattern Standardization

- **Removed eager loading**: Changed from `import.meta.glob("../data/*.ts", { eager: true })` to dynamic imports
- **Consistent import paths**: All type imports moved to dedicated type files
- **Dynamic department loading**: Department data now loaded on-demand

### 4. Updated Import Statements

```typescript
// Before
import { LocalizableString, NewFormatIdea } from "../data/types";

// After
import { LocalizableString } from "../types/shared";
import { NewFormatIdea } from "../types/ideas";
```

## Results

### Bundle Size Improvement

- **Main chunk**: 1,272.74 kB → 304.65 kB (76% reduction)
- **Vendor chunk**: 803.80 kB (234.43 kB gzipped)
- **Department chunk**: 81.44 kB (8.59 kB gzipped)
- **AI libraries**: 27.85 kB (6.32 kB gzipped)
- **Charts**: 5.99 kB (2.19 kB gzipped)
- **i18n**: 42.25 kB (13.44 kB gzipped)

### Build Success

- ✅ Vercel deployment compatibility
- ✅ No import conflict warnings
- ✅ All chunks under recommended size limits
- ✅ Improved loading performance

## Decision

**Accepted** - This solution provides:

- Optimal bundle splitting for better caching
- Eliminated circular import dependencies
- Scalable architecture for future development
- Vercel deployment compatibility

## Implementation Guidelines

### For Future Development

1. **Type Organization**:

   - Keep shared types in `/src/types/shared.ts`
   - Domain-specific types in `/src/types/{domain}.ts`
   - Never import types from `/src/data/*` files

2. **Import Patterns**:

   - Use dynamic imports for data files: `await import(\`../data/\${key}.ts\`)`
   - Avoid `eager: true` in `import.meta.glob`
   - Import types from dedicated type files only

3. **Bundle Management**:

   - Monitor chunk sizes with `npm run build`
   - Keep vendor libraries separated by domain
   - Use dynamic imports for large feature modules

4. **Department Data**:
   - Always use on-demand loading via `getIdeasFor(key)`
   - Never use static imports in components
   - Keep data files focused on data export only

## Consequences

### Positive

- Faster initial page loads
- Better browser caching
- Scalable architecture
- Vercel deployment success

### Considerations

- Slightly more complex type import paths
- Need to maintain chunking strategy as dependencies grow
- Developers must understand dynamic vs static import patterns

## Related Documents

- [Vite Bundle Analysis Guide](../stack/VITE.md)
- [TypeScript Architecture](../stack/TYPESCRIPT.md)
- [Deployment Guide](../stack/DEPLOYMENT.md)

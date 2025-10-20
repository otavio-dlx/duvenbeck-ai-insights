# Copilot Instructions for Duvenbeck AI Insights

## Project Overview

This is a **React + Vite + TypeScript** dashboard for visualizing AI initiative ideas collected from comprehensive workshops across all departments at Duvenbeck. The app serves as a strategic tool for leadership to evaluate, prioritize, and present AI opportunities.

## Architecture Highlights

### Dual API Architecture

- **Frontend**: Vite dev server on port 8080
- **Local API**: Express server (`server/index.ts`) on port 3001 for development
- **Serverless API**: Vercel functions in `api/` directory for production
- **Proxy Setup**: Vite config proxies `/api/*` to local Express server

### RAG (Retrieval-Augmented Generation) System

The core feature is a chat interface powered by:

- **Vector DB**: Qdrant Cloud for semantic search
- **Embeddings**: Google `text-embedding-004` model
- **LLM**: Google Gemini 2.0 Flash for responses
- **Fallback**: In-memory search when Qdrant unavailable
- **Data Source**: Department workshop data in `src/data/*.ts` files

Key files: `src/services/ragService.ts`, `api/rag/search.ts`, `server/index.ts`

### Translation-Key Architecture

**Critical Pattern**: All content uses translation keys, not direct text:

```typescript
// Department data structure
{
  ideaKey: "accounting.ideas.automated_invoice_processing",
  problemKey: "accounting.problems.automated_invoice_processing",
  solutionKey: "accounting.solutions.automated_invoice_processing"
}
```

Translation files: `src/i18n/locales/{de,en}.json`

## Development Workflows

### Essential Commands

```bash
# Start full development (frontend + backend)
npm run dev

# Individual services
npm run dev:vite     # Frontend only (port 8080)
npm run dev:api      # Backend only (port 3001)

# Vector database operations
npm run upload-to-vector-db    # Upload workshop data to Qdrant
npm run test-qdrant           # Test Qdrant connection
npm run test-search           # Test search functionality

# Testing
npm test              # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
```

### Data Management Workflow

1. **Update department data** in `src/data/{department}.ts`
2. **Add translations** to `src/i18n/locales/*.json`
3. **Upload to vector DB**: `npm run upload-to-vector-db`
4. **Test search**: `npm run test-search`

## Project-Specific Patterns

### Department Data Structure

Each department file (`src/data/{department}.ts`) follows this exact pattern:

```typescript
export const ideas = {
  home: [
    {
      date: "2025-10-06",
      department: "Department Name",
      collaboardLink: "https://...",
    },
  ],
  ideas: [
    {
      // NewFormatIdea interface
      finalPrio: "1-A",
      ideaKey: "dept.ideas.identifier",
      problemKey: "dept.problems.identifier",
      solutionKey: "dept.solutions.identifier",
      owner: "Team Name",
      complexity: 3, // 1-5 scale
      cost: 2, // 1-5 scale
      roi: 4, // 1-5 scale
      risk: 2, // 1-5 scale
      strategicAlignment: 5, // 1-5 scale
    },
  ],
};
```

### Component Patterns

- **UI Components**: Use shadcn/ui from `src/components/ui/`
- **Page Components**: In `src/pages/` - correspond to routes
- **Styling**: Tailwind CSS with `tailwind-merge` and `clsx` for conditional styles
- **State**: React hooks, Context API (`TaggingContext`), React Query for data fetching

### Testing Strategy

- **Unit Tests**: Co-located `.test.ts` files using Vitest + React Testing Library
- **Data Integrity**: `src/tests/data-integrity.test.ts` validates translation keys
- **E2E Tests**: Playwright for full user flows
- **Critical Test**: Verify all translation keys exist in both `de.json` and `en.json`

## Environment & Dependencies

### Required Environment Variables

```bash
VITE_QDRANT_URL=https://xxx.gcp.cloud.qdrant.io:6333
VITE_QDRANT_API_KEY=eyJ...
VITE_GEMINI_API_KEY=AIza...
```

### Key Dependencies

- **UI**: `@radix-ui/*`, `shadcn/ui`, `tailwindcss`
- **Data**: `@tanstack/react-query`, `react-hook-form`, `zod`
- **AI/ML**: `@google/generative-ai`, `@qdrant/js-client-rest`
- **Development**: `tsx`, `concurrently`, `vitest`, `@playwright/test`

## Integration Points

### Vector Database Upload Process

Run `scripts/uploadToVectorDB.ts` to:

1. Load all department data from `src/data/*.ts`
2. Create embeddings using Google's model
3. Upload to Qdrant with metadata (department, owner, priority, type)
4. Creates separate vectors for ideas, problems, and solutions

### Translation System Integration

When updating department data:

1. **Never add direct text** - always use translation keys
2. **Follow naming convention**: `department.category.identifier`
3. **Update both languages**: German (original) and English (translation)
4. **Run data integrity tests** to verify key consistency

## Critical Conventions

### Branch Strategy

- `main` is primary branch
- Feature branches: `feat/short-description`
- Bug fixes: `fix/short-description`

### Commit Messages

Format: `<area>: short description`
Examples: `components: add LoginGate fallback`, `data: update compliance metrics`

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Data files: `snake_case.ts`
- Tests: `{filename}.test.{tsx|ts}`

## Common Gotchas

1. **Translation Keys**: Always validate keys exist in both language files before using
2. **Vector DB**: Must upload data after changing department files for chat to work
3. **API Proxy**: Local development requires both Vite and Express servers running
4. **Environment**: Qdrant/Gemini credentials required for full functionality
5. **Data Updates**: Follow exact `NewFormatIdea` interface - missing fields cause errors

## Bundle Optimization & Import Patterns

**CRITICAL**: Follow these patterns to avoid build failures and deployment issues:

### Type Import Rules

**✅ CORRECT - Use dedicated type files:**

```typescript
import { LocalizableString } from "@/types/shared";
import { NewFormatIdea } from "@/types/ideas";
```

**❌ INCORRECT - Never import types from data files:**

```typescript
import { NewFormatIdea } from "@/data/types"; // Causes circular imports
```

### Dynamic Import Patterns

**✅ CORRECT - Dynamic data loading:**

```typescript
// Use existing helper functions
const data = await getIdeasFor(departmentKey);

// Or direct dynamic import
const module = await import(`../data/${key}.ts`);
```

**❌ INCORRECT - Eager static imports:**

```typescript
import.meta.glob("../data/*.ts", { eager: true }); // Breaks chunking
```

### Department Data Access

**✅ CORRECT - On-demand loading:**

```typescript
import { getIdeasFor, listDataKeys } from "@/lib/data";

// Load specific department
const ideas = await getIdeasFor("accounting");

// List all available departments
const keys = await listDataKeys();
```

**❌ INCORRECT - Direct imports in components:**

```typescript
import { ideas as accountingData } from "@/data/accounting"; // Breaks lazy loading
```

### Bundle Size Monitoring

- Run `npm run build` before commits to check chunk sizes
- Main chunk should stay under 500KB
- Vendor libraries automatically split by domain (ui, charts, ai, etc.)
- Department data loads in separate `departments` chunk

### Type Organization

- **Shared types**: `/src/types/shared.ts` (LocalizableString, TranslatedString)
- **Business types**: `/src/types/ideas.ts` (NewFormatIdea, HomeInfo)
- **Legacy types**: `/src/data/types.ts` (keep for compatibility but don't import from)
- **Component types**: Co-locate with components or in `/src/types/{domain}.ts`

## Testing Checklist

Before PR:

- [ ] `npm run build` passes (check bundle sizes in output)
- [ ] `npm test` passes
- [ ] Translation keys validated in both languages
- [ ] Vector DB updated if department data changed
- [ ] Chat functionality tested if RAG-related changes
- [ ] No circular import warnings in build output
- [ ] Bundle chunks remain under size limits
- [ ] Type imports follow new pattern (from `/src/types/*` only)

## Documentation

- Architecture decisions: `docs/adr/*.md`
- Department details: `docs/departments/*.md`
- Technology stack: `docs/stack/*.md`
- Cursor-specific rules: `.cursor/*.mdc`

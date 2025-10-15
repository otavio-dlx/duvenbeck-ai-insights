# Chat Feature Documentation

## Overview

The Duvenbeck AI Insights application includes a RAG (Retrieval-Augmented Generation) powered chat feature that allows users to query workshop data using natural language. This document explains the architecture, setup, and troubleshooting process.

## Architecture

### Components

1. **Frontend (React + Vite)**

   - Chat UI at `/src/pages/ChatPage.tsx`
   - RAG service at `/src/services/ragService.ts`
   - Runs on port `8080`

2. **Backend API (Express)**

   - Local development server at `/server/index.ts`
   - Handles `/api/rag/search` endpoint
   - Runs on port `3001`
   - Auto-reloads with `tsx watch`

3. **Vector Database (Qdrant)**

   - Cloud-hosted Qdrant instance
   - Collection: `duvenbeck_workshop_ideas`
   - Stores embeddings of workshop ideas, problems, and solutions

4. **LLM (Google Gemini)**
   - Text embedding model: `text-embedding-004`
   - Chat model: `gemini-1.5-flash`
   - Used for both generating embeddings and responses

### Data Flow

```
User Query → Frontend → Vite Proxy → Express API → Qdrant (search) → Express → Frontend → Gemini (response) → User
```

1. User types a question in the chat
2. Frontend calls `/api/rag/search` with the query
3. Vite dev server proxies the request to Express (port 3001)
4. Express generates an embedding using Gemini
5. Express searches Qdrant for similar vectors
6. Results are returned to frontend
7. Frontend sends results + query to Gemini for natural language response
8. Response is displayed to user

## Setup

### Environment Variables

Create a `.env` file with:

```bash
# Authentication
VITE_AUTH_PASSWORD=your-password-here
VITE_AUTH_STORAGE_KEY=your-storage-key-here

# Qdrant Vector Database
VITE_QDRANT_URL=https://your-qdrant-instance.cloud.qdrant.io:6333
VITE_QDRANT_API_KEY=your-qdrant-api-key

# Google Gemini API
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### Installation

```bash
npm install
```

Key dependencies:

- `express` - Backend API server
- `cors` - CORS handling
- `@qdrant/js-client-rest` - Qdrant client
- `@google/generative-ai` - Gemini AI client
- `concurrently` - Run multiple dev servers
- `tsx` - TypeScript execution with hot reload

### Development

Start both Vite and Express servers:

```bash
npm run dev
```

This runs:

- `npm run dev:vite` - Vite frontend on port 8080
- `npm run dev:api` - Express API on port 3001

### Production (Vercel)

For production deployment, the `/api/rag/search.ts` serverless function is used instead of the Express server. The same logic is implemented in both for consistency.

## File Structure

```
.
├── src/
│   ├── pages/
│   │   └── ChatPage.tsx          # Chat UI component
│   ├── services/
│   │   ├── ragService.ts         # RAG search logic (frontend)
│   │   └── geminiApi.ts          # Gemini API integration
│   └── data/                     # Workshop data files
├── server/
│   └── index.ts                  # Express API server (local dev)
├── api/
│   └── rag/
│       └── search.ts             # Vercel serverless function (production)
├── scripts/
│   ├── uploadToVectorDB.ts       # Upload data to Qdrant
│   ├── testQdrantConnection.ts   # Test Qdrant connection
│   └── testSearchFlow.ts         # Test full search flow
└── vite.config.ts                # Vite config with API proxy
```

## Testing

### Test Qdrant Connection

```bash
npm run test-qdrant
```

Verifies:

- Qdrant credentials are correct
- Collection `duvenbeck_workshop_ideas` exists
- Can perform basic search operations

### Test Search Flow

```bash
npm run test-search
```

Tests the complete flow:

1. Generate embedding for test query
2. Search Qdrant
3. Display results
4. Verify data format

### Upload Data to Qdrant

```bash
npm run upload-to-vector-db
```

Uploads all workshop ideas from `/src/data/` to Qdrant with embeddings.

## Troubleshooting Journey

### Issue 1: CORS Errors

**Problem:** Frontend couldn't access Qdrant directly due to CORS restrictions.

**Solution:** Created a backend API proxy instead of direct client-side Qdrant access.

### Issue 2: Vercel Dev Not Serving API Routes (404)

**Problem:** Using `npm run dev` (Vite only) didn't serve the `/api/rag/search` endpoint.

**Attempted Solution:** Tried `vercel dev` but it added complexity.

**Final Solution:** Created a simple Express server that runs alongside Vite during development:

- Express handles `/api/*` routes on port 3001
- Vite proxy forwards `/api/*` requests to Express
- Both run concurrently with one command: `npm run dev`

### Issue 3: Wrong Collection Name (500 Error)

**Problem:** Express server searched for `workshop_ideas` collection.

**Root Cause:** Actual Qdrant collection is named `duvenbeck_workshop_ideas`.

**Solution:** Updated collection name in `/server/index.ts` to match the test scripts.

### Issue 4: Server Kept Dying

**Problem:** Running test commands killed the dev server.

**Solution:** Ensured commands run in separate terminal contexts and restart dev server after tests.

## API Endpoints

### POST `/api/rag/search`

Search the vector database for relevant workshop data.

**Request:**

```json
{
  "query": "What are the HR ideas?",
  "limit": 10
}
```

**Response:**

```json
{
  "results": [
    {
      "id": "uuid",
      "score": 0.85,
      "payload": {
        "text": "hr.ideas.flexible_working",
        "department": "hr",
        "ideaKey": "hr.ideas.flexible_working",
        "owner": "John Doe",
        "priority": "high",
        "finalPrio": 8.5,
        "type": "idea"
      }
    }
  ]
}
```

### GET `/api/health`

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-15T10:00:00.000Z"
}
```

## Vite Configuration

The Vite proxy configuration forwards API requests to Express:

```typescript
// vite.config.ts
export default defineConfig({
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
  // ...
});
```

## Express Server Configuration

```typescript
// server/index.ts
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/rag/search", async (req, res) => {
  // 1. Extract query from request
  // 2. Generate embedding with Gemini
  // 3. Search Qdrant
  // 4. Return results
});
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:vite\" \"npm run dev:api\"",
    "dev:vite": "vite",
    "dev:api": "tsx watch server/index.ts",
    "dev:vercel": "vercel dev",
    "upload-to-vector-db": "tsx scripts/uploadToVectorDB.ts",
    "test-qdrant": "tsx scripts/testQdrantConnection.ts",
    "test-search": "tsx scripts/testSearchFlow.ts"
  }
}
```

## Key Learnings

1. **Avoid Direct Browser-to-Qdrant:** CORS restrictions make it impractical. Use a backend proxy.

2. **Simple is Better:** Express + Vite proxy is simpler than Vercel dev for local development.

3. **Collection Names Matter:** Ensure consistency between upload scripts, test scripts, and API code.

4. **Environment Variables:** Use `.env` file and `dotenv` package. Prefix with `VITE_` for frontend access.

5. **Hot Reload:** Use `tsx watch` for the API server to auto-reload on changes.

6. **Concurrent Servers:** Use `concurrently` to run multiple dev servers with one command.

## Future Improvements

- [ ] Add caching layer for frequently asked questions
- [ ] Implement streaming responses from Gemini
- [ ] Add conversation history/context
- [ ] Implement rate limiting on API endpoints
- [ ] Add monitoring and analytics
- [ ] Support multiple languages in chat responses
- [ ] Add file upload for custom queries
- [ ] Implement user feedback mechanism

## AI Agent Behavior

### Scope & Boundaries

The chat agent is specifically designed for the **Duvenbeck AI Workshop (October 6-8, 2025, online event)**. It has strict boundaries:

**What it CAN do:**

- Answer questions about workshop ideas, problems, and solutions
- Provide information about specific departments
- Explain priorities, owners, and implementation details
- List and compare workshop outputs

**What it CANNOT do:**

- Discuss topics unrelated to the workshop
- Provide general business advice
- Access information outside the workshop data
- Make up or speculate on information

### Response Patterns

**For greetings (e.g., "Hi", "Hello"):**

- Responds warmly and briefly
- Introduces itself as the Duvenbeck AI Workshop assistant
- Invites the user to ask about workshop content
- Does NOT dump unsolicited information

**For workshop-related queries WITH matching data:**

- Provides specific information from the vector database
- Always includes: Department, Owner, Priority, Type
- Cites actual workshop content
- Uses clear structure and formatting

**For workshop-related queries WITHOUT matching data:**

- Politely states it doesn't have information on that specific topic
- Suggests the user might try rephrasing or asking about other departments

**For off-topic queries:**

- Politely declines to answer
- Explains its scope is limited to the Duvenbeck AI Workshop
- Redirects user back to workshop-related topics

### Example Interactions

**Greeting:**

```
User: "Hi"
Agent: "Hello! I'm your assistant for the Duvenbeck AI Workshop that took place
online from October 6-8, 2025. I can help you explore the ideas, problems, and
solutions generated during the workshop. What would you like to know?"
```

**Workshop Query with Data:**

```
User: "What are the HR ideas?"
Agent: "Based on the workshop, here are the HR-related ideas:
- [HR - IDEA] (Owner: John Doe, Priority: High): Flexible working arrangements...
- [HR - IDEA] (Owner: Jane Smith, Priority: Medium): Employee development program...
..."
```

**Workshop Query without Data:**

```
User: "What ideas do we have about blockchain?"
Agent: "I don't have any specific information about blockchain in the workshop
data from October 6-8, 2025. The workshop focused on [departments present].
Would you like to know about ideas from any of these departments?"
```

**Off-Topic Query:**

```
User: "What's the weather like?"
Agent: "I'm specifically designed to help with the Duvenbeck AI Workshop
(October 6-8, 2025) and can only discuss workshop-related topics like ideas,
problems, and solutions from various departments. Is there anything from the
workshop you'd like to know about?"
```

## Resources

- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## Support

For issues or questions:

1. Check the terminal output for error messages
2. Run test scripts to verify components
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

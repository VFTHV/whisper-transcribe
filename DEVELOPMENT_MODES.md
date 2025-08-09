# Development Modes Guide

This project supports multiple development modes depending on your needs.

## Available Commands

### 🚀 `npm run dev` (Netlify Development - Recommended)

- **What it runs**: Netlify Dev + Vite
- **Ports**:
  - Frontend: http://localhost:8888 (Netlify proxy)
  - Vite dev server: http://localhost:5173 (internal)
- **API**: Uses Netlify Functions (`/api/*` → `/.netlify/functions/*`)
- **Best for**: Testing production-like environment, Netlify deployment prep

### ⚡ `npm run dev:all` (Traditional Development)

- **What it runs**: Express Server + Vite (separate processes)
- **Ports**:
  - Frontend: http://localhost:5173 (Vite)
  - Backend: http://localhost:3001 (Express)
- **API**: Uses Express server (`/api/*` → `http://localhost:3001/api/*`)
- **Best for**: Backend development, debugging Express routes

### 🔧 `npm run dev:vite` (Frontend Only)

- **What it runs**: Vite dev server only
- **Port**: http://localhost:5173
- **API**: No backend (for UI-only development)
- **Best for**: Frontend development without API calls

### 🖥️ `npm run dev:server` (Backend Only)

- **What it runs**: Express server only
- **Port**: http://localhost:3001
- **Best for**: API testing, backend development

## Automatic API Routing

The app automatically detects which mode you're running:

- **Port 5173** (Vite only) → Uses Express server at `http://localhost:3001/api/*`
- **Port 8888** (Netlify Dev) → Uses Netlify Functions at `/api/*`

This is handled by `src/utils/apiConfig.ts`.

## When to Use Each Mode

### Use `npm run dev` when:

- ✅ Preparing for Netlify deployment
- ✅ Testing Netlify Functions
- ✅ Want production-like environment
- ✅ Testing the complete serverless setup

### Use `npm run dev:all` when:

- ✅ Developing Express server features
- ✅ Debugging backend issues
- ✅ Need hot reload for both frontend and backend
- ✅ Working with file uploads/server-side features

## Environment Variables

Both modes support:

- `.env` file in root (for Vite)
- `.env` file in `server/` directory (for Express)

## File Structure Impact

```
whisper-transcribe/
├── src/                    # Frontend (works with both modes)
├── server/                 # Express server (dev:all mode)
├── netlify/functions/      # Netlify Functions (dev mode)
└── src/utils/apiConfig.ts  # Smart API routing
```

## Switching Between Modes

You can switch between modes without any code changes - the API routing is automatic!

1. Stop current dev server (Ctrl+C)
2. Run desired command (`npm run dev` or `npm run dev:all`)
3. The app automatically detects and uses the correct API endpoints

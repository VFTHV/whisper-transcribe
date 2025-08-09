# Netlify Deployment Guide

This project has been configured to deploy on Netlify with serverless functions.

## Project Structure

```
whisper-transcribe/
├── src/                    # React frontend
├── server/                 # Original Express server (kept for reference)
├── netlify/
│   └── functions/         # Netlify Functions
│       ├── health.ts      # Health check endpoint
│       ├── transcribe.ts  # Audio transcription endpoint
│       └── package.json   # Functions dependencies
├── netlify.toml           # Netlify configuration
└── _headers              # CORS headers configuration
```

## API Endpoints

The following endpoints are available:

- `GET /api/health` - Health check
- `POST /api/transcribe` - Audio transcription using OpenAI Whisper

## Development

### Local Development with Netlify CLI

```bash
npm run dev
```

This runs `netlify dev` which:

- Starts the Vite dev server
- Runs Netlify Functions locally
- Provides the same environment as production

### Traditional Development (with Express server)

```bash
npm run dev:all
```

This runs both the Express server and Vite dev server concurrently.

## Deployment

### Automatic Deployment

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Manual Deployment

```bash
npm run build
netlify deploy --prod
```

## Environment Variables

No server-side environment variables are needed since users provide their own OpenAI API keys through the frontend.

## Key Changes from Express Server

1. **Serverless Functions**: API endpoints are now Netlify Functions instead of Express routes
2. **No File System**: Audio files are processed in memory instead of being saved to disk
3. **CORS Handling**: Built into each function instead of Express middleware
4. **Multipart Parsing**: Custom implementation for serverless environment

## Benefits

- **Serverless**: No server management required
- **Scalable**: Automatic scaling based on demand
- **Cost-effective**: Pay only for function execution time
- **Global CDN**: Netlify's global edge network
- **Easy Deployment**: Git-based deployment workflow

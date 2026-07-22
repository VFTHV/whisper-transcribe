# Whisper Transcribe

Voice-to-text transcription app built with React, Vite, Material UI, and OpenAI Whisper via Netlify Functions. Record audio in the browser and get a transcription using your own OpenAI API key.

## Stack

- React 19 + TypeScript + Vite
- Material UI (Exo 2)
- Netlify Functions (`health`, `transcribe`)
- OpenAI Whisper / GPT-4o transcribe models
- Google Analytics 4 (Firebase)

## Commands

```bash
npm install
npm start          # Netlify Dev (frontend + functions) on http://localhost:8888
npm run build      # production build → dist/
npm run lint
```

| Command | Use |
| --- | --- |
| `npm start` | Local development (`netlify dev`). Vite + Functions on port **8888**. |
| `npm run build` | What Netlify runs on deploy after merge to **`master`**. Publishes `dist`. |

Do **not** set the Netlify production build command to `npm start` — that only runs the local Netlify Dev server.

## Live site

- Production: https://whisper-stt.netlify.app
- Admin: https://app.netlify.com/projects/whisper-stt

## Netlify site

- Site name: `whisper-stt`
- Site ID: `3bcd8573-959d-43b0-b5aa-8f3d6360aaf2`
- Team: VFTHV's team (`vfthv`)
- Default subdomain: `whisper-stt.netlify.app`
- Repo: `VFTHV/whisper-transcribe` → branch `master` → build `npm run build` → publish `dist`
- Functions: `netlify/functions`
- Local config: [`netlify.toml`](netlify.toml) (`[dev]` port `8888`)

After merge to `master`, Netlify CI builds with `npm run build` and deploys `dist` plus serverless functions. Local work uses `npm start`.

## Environment

Users enter their OpenAI API key in the app UI (stored client-side). No server-side `OPENAI_API_KEY` is required for production deploy.

Optional local `.env` (for Netlify Functions when testing without the UI key):

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## API endpoints

- `GET /.netlify/functions/health` — health check
- `POST /.netlify/functions/transcribe` — multipart audio transcription

## Firebase / Analytics

GA4 is loaded via gtag in [`index.html`](index.html) (same pattern as Medovik). Netlify hosts the site; Firebase is used for Analytics only.

| Field | Value |
| --- | --- |
| Project ID | `vfthv-whisper-stt` |
| Display name | Whisper STT |
| Web app ID | `1:1039927906280:web:0d1c11e2ee83dbd8cade5d` |
| Measurement ID | `G-H4GFDC0W0C` |
| Console | https://console.firebase.google.com/project/vfthv-whisper-stt |
| Analytics | https://console.firebase.google.com/project/vfthv-whisper-stt/analytics |

Local alias: [`.firebaserc`](.firebaserc) defaults to `vfthv-whisper-stt`.

> Note: Project IDs `whisper-stt` and `whisper-transcribe` were already taken globally, so the Firebase project is `vfthv-whisper-stt`. The Netlify site remains `whisper-stt`.

## License

MIT

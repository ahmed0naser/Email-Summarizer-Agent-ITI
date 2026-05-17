# Email Summarizer Agent (Angular frontend)

This is a TypeScript + OpenAI Agents SDK project with an Angular frontend and an Express backend that provides the `/api` endpoints.

**Quick overview**

- Backend: serves API routes under `/api` and static frontend when built.
- Frontend: Angular app in `client-angular/` (dev server proxies `/api` to the backend).

**Prerequisites**

- Node.js 18+ and npm
- An OpenAI API key

## Setup

1. Create `.env` from the example and add your OpenAI key:

```bash
cp .env.example .env
# then edit .env and set OPENAI_API_KEY and optionally PORT
```

2. Install root (server) dependencies:

```bash
npm install
```

3. Install frontend dependencies (in a separate shell):

```bash
cd client-angular
npm install
```

## Development (recommended)

1. Start the backend (project root):

```bash
npm run dev
```

2. Start the Angular dev server (will proxy `/api` to the backend):

```bash
cd client-angular
npm start
```

Open the frontend at `http://localhost:4200` and the backend health check at `http://localhost:3001/api/health` (or the `PORT` set in `.env`).

## Production build

1. Build the Angular app:

```bash
cd client-angular
npm run build
```

2. The server automatically prefers serving the built app from `client-angular/dist/client-angular` if that folder exists. Alternatively, copy the built files into the existing `server/public` folder before starting the server.

3. Start the server (project root):

```bash
npm start
```

The server listens on the `PORT` from `.env` (default `3001`) and serves both API routes and static frontend files.

## API

- `GET /api/health` — returns `{ ok: true }`.
- `POST /api/summarize` — accepts `multipart/form-data` with `email` (text) and an optional file field `emailFile`; returns `{ summary }`.

## Notes

- During development, the Angular dev server proxies `/api` to `http://localhost:3001` using `client-angular/proxy.conf.json`.
- The server will serve the production Angular build automatically if present in `client-angular/dist/client-angular`.

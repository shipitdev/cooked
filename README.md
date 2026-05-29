# COOKED

COOKED is a small full-stack app that pulls a user's Spotify top artists and tracks, sends that taste profile to Gemini, and returns one short roast in a brutalist dashboard UI.

The app also has a demo fallback, so it can still run locally without live Spotify or Gemini credentials.

## Stack

- Backend: Python, FastAPI, Spotipy, Google GenAI
- Frontend: React, Vite, Tailwind CSS, Framer Motion
- APIs: Spotify Web API, Gemini

## Project Structure

```text
.
├── server.py
├── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Environment

Create a `.env` file in the project root:

```env
SPOTIPY_CLIENT_ID=your_spotify_client_id
SPOTIPY_CLIENT_SECRET=your_spotify_client_secret
SPOTIPY_REDIRECT_URI=http://127.0.0.1:8080/callback
GEMINI_API_KEY=your_gemini_api_key

# optional
DEMO_MODE=false
GEMINI_MODEL=gemini-2.5-flash
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

For the frontend, create `frontend/.env` if the backend is not running on the default local URL:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Local Setup

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## API

Health check:

```http
GET /health
```

Generate a roast:

```http
GET /roast-me?time_range=long_term&style=elitist
```

Supported `time_range` values:

- `short_term`
- `medium_term`
- `long_term`

Supported `style` values:

- `elitist`
- `condescending`
- `boomer`

## Demo Mode

The backend falls back to mock artists, tracks, and roasts when credentials are missing or `DEMO_MODE=true`.

That makes the UI testable without connecting a real Spotify account.

## Production Notes

- Set `VITE_API_URL` to the deployed backend URL.
- Set `CORS_ORIGINS` to the deployed frontend URL instead of `*`.
- Run the backend without `--reload`.
- Keep `.env` out of git.
- Make sure the Spotify redirect URI matches the environment you are using.

Example backend command for a host that provides `$PORT`:

```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

Build the frontend:

```bash
cd frontend
npm run build
```

## Checks

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend smoke check:

```bash
DEMO_MODE=true python3 -c 'from fastapi.testclient import TestClient; from server import app; c=TestClient(app); print(c.get("/health").json())'
```

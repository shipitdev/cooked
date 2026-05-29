# Production Upgrade Plan

Goal: get COOKED from a local demo into something that can run reliably for real users without leaking secrets, breaking on deploy, or hiding useful errors.

## 1. Lock Down Config

- keep `.env` local only and add a checked-in `.env.example`
- move the frontend API URL into `VITE_API_URL` instead of hardcoding `http://127.0.0.1:8000`
- make the backend fail clearly when required env vars are missing in production
- keep demo/mock mode available, but make it an explicit flag like `DEMO_MODE=true`
- document the Spotify redirect URI needed for local and production

## 2. Backend Readiness

- add a simple `GET /health` route that returns status, app name, and mode
- replace `print` debugging with normal logging
- tighten CORS so production only allows the deployed frontend domain
- return cleaner API errors when Spotify or Gemini fails
- add request timeouts around external calls where the libraries allow it
- make sure the Gemini model name is configurable from env
- check whether Spotify token storage needs a safer production location

## 3. Frontend Readiness

- swap the hardcoded backend URL for `import.meta.env.VITE_API_URL`
- show a proper error state when the backend is offline or an API call fails
- add a quiet empty state before the first roast
- disable the main action while loading, and keep the loading state obvious
- do one mobile pass for spacing, tap targets, and text overflow
- remove old starter assets if they are not used anymore

## 4. Security Pass

- confirm no real keys are committed anywhere
- rotate keys if they were ever pasted into shared history
- avoid exposing raw backend errors to the browser
- set production CORS origins by env, not by editing code every deploy
- add basic rate limiting before sharing the app publicly
- keep OAuth scopes as small as possible; `user-top-read` should be enough

## 5. Build And Deploy Shape

- pick the split clearly:
  - frontend: Vercel, Netlify, or any static host
  - backend: Render, Fly.io, Railway, or a small VPS
- add production start command for the backend, probably `uvicorn server:app --host 0.0.0.0 --port $PORT`
- run `npm run build` inside `frontend`
- run the backend once without `--reload`
- add the production frontend URL to Spotify redirect settings if the auth flow needs it
- test the deployed frontend against the deployed backend, not localhost

## 6. Testing Before Shipping

- clean install backend dependencies in a fresh virtualenv
- clean install frontend dependencies with `npm ci`
- run frontend lint
- run a real Spotify account through the flow
- test with missing Gemini key and missing Spotify keys to make sure failures are readable
- test short term, medium term, and long term ranges
- test each critic style
- check browser console and backend logs after a full run

## 7. Nice But Not Blocking

- add a small request history panel for the last roast
- add copy-to-clipboard for the final verdict
- add a short privacy note explaining what Spotify data is read
- add a screenshot or GIF to the README once the UI is stable
- add a tiny analytics-free usage counter on the backend if needed later

## Ship Checklist

- `.env.example` exists
- frontend API URL is environment-based
- `/health` works
- CORS is not wildcard in production
- production start commands are written down
- frontend builds cleanly
- backend starts without reload
- no secrets in git
- real Spotify + Gemini flow tested once end to end

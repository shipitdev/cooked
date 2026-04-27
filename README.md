# COOKED

## Industrial Identity Analysis & Roast Engine

An experimental full-stack interface that leverages the Spotify Web API and Gemini 1.5 Flash to perform automated personality deconstruction. The project explores **Intentional Friction** in UI/UX through a high-density, industrial-brutalist dashboard.

---

## 🏗️ Technical Architecture

The system is designed with a decoupled architecture to ensure clear separation of concerns and low-latency data flow.

### Backend [Python / FastAPI]

- **Asynchronous Execution:** Utilizes `asyncio` for non-blocking I/O during Spotify metric ingestion and Gemini API calls.
- **Stateless Auth:** Implements OAuth 2.0 Authorization Code Flow via `Spotipy` for secure, scoped access to user metrics.
- **Prompt Engineering:** Employs strict system instructions to enforce output constraints (15-word max, plain-text sanitization) ensuring a consistent "Gallery" aesthetic.

### Frontend [React 19 / Tailwind v4]

- **Modular Grid Logic:** Built on a rigid 12-column grid system with hard borders and vertical labeling to emulate industrial hardware.
- **Optimized Rendering:** Leverages `Framer Motion` for high-performance layout transitions and spring-based animations.
- **Zero-Config Styling:** Early adoption of Tailwind v4 for CSS-variable-based theme management.

---

## 📡 Core Logic Flow

1. **Ingestion:** Backend pulls `user-top-read` data, extracting tokens for artists, genres, and frequency.
2. **Sanitization:** Data is filtered to remove metadata noise before being injected into the LLM context window.
3. **Synthesis:** Gemini 1.5 Flash generates a singular, hostile "Verdict" based on the ingested profile.
4. **Rendering:** The frontend maps the JSON response into a technical module with real-time system status indicators.

---

## 🛠️ Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- Spotify Developer Account (for Client ID/Secret)
- Google AI Studio API Key

### Backend Setup

1. pip install -r requirements.txt
2. Create a `.env` file:
   ```env
   SPOTIPY_CLIENT_ID='your_id'
   SPOTIPY_CLIENT_SECRET='your_secret'
   SPOTIPY_REDIRECT_URI='[http://127.0.0.1:8080/callback](http://127.0.0.1:8080/callback)'
   GEMINI_API_KEY='your_key'
   ```
3. uvicorn main:app --port 8000 --reload
4. Navigate to '/frontend' and Install dependencies (using legacy peer deps for v4 compatibility):
   npm install --legacy-peer-deps
   npm run dev

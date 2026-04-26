import os
from fastapi import FastAPI
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from google import genai
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

scope = 'user-top-read'

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
    scope=scope
))

@app.get("/roast-me")
def roast_me():
    try:
        results = sp.current_user_top_artists(limit=5, time_range='long_term')
        if not results['items']:
         return {"artists": [], "roast": "Listen to some music first, you robot."}

        artists_name = [item['name'] for item in results['items']]

        if not artists_name:
            return {"artists": [], "roast": "Listen to some music first, you robot."}

        prompt = f"Here are my top artists: {', '.join(artists_name)}. Roast my music taste in 2 sentences."
        print(f"DEBUG: Sending to Gemini -> {artists_name}")
        
        response = client.models.generate_content(
           model="gemini-2.5-flash",
           contents=prompt
        )

        return {
            "artists" : artists_name,
            "roast" : response.text
        }

    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}

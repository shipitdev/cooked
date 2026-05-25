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
    allow_origins=["*"],
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
def roast_me(time_range: str = 'long_term', style: str = 'elitist'):
    if time_range not in ['short_term', 'medium_term', 'long_term']:
        time_range = 'long_term'
    if style not in ['elitist', 'condescending', 'boomer']:
        style = 'elitist'

    client_id = os.getenv("SPOTIPY_CLIENT_ID")
    client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
    gemini_key = os.getenv("GEMINI_API_KEY")

    is_mock = (
        not client_id or client_id == "CLIENTID_HERE" or
        not client_secret or client_secret == "SECRET_HERE" or
        not gemini_key or gemini_key == "API_KEY_HERE"
    )

    artists_name = []
    tracks_name = []
    roast_text = ""

    if not is_mock:
        try:
            artists_results = sp.current_user_top_artists(limit=5, time_range=time_range)
            artists_name = [item['name'] for item in artists_results.get('items', [])]

            tracks_results = sp.current_user_top_tracks(limit=5, time_range=time_range)
            tracks_name = [item['name'] for item in tracks_results.get('items', [])]
        except Exception as e:
            print(f"Spotify API failed: {e}. Falling back to mock data.")
            is_mock = True

    if is_mock:
        if time_range == 'short_term':
            artists_name = ["Billie Eilish", "Charli XCX", "Fred again..", "Chappell Roan", "Sabrina Carpenter"]
            tracks_name = ["BIRDS OF A FEATHER", "360", "leavemealone", "Good Luck, Babe!", "Espresso"]
        elif time_range == 'medium_term':
            artists_name = ["Tame Impala", "The Weeknd", "Dua Lipa", "Kendrick Lamar", "Olivia Rodrigo"]
            tracks_name = ["Borderline", "Blinding Lights", "Levitating", "Not Like Us", "vampire"]
        else:
            artists_name = ["Radiohead", "The Strokes", "Lana Del Rey", "Daft Punk", "Nirvana"]
            tracks_name = ["Karma Police", "Reptilia", "Born to Die", "Get Lucky", "Smells Like Teen Spirit"]

        import random
        if style == 'elitist':
            roasts = [
                f"Your taste is a curated starter pack for teenagers trying to look interesting on Reddit.",
                f"Listening to {artists_name[0]} doesn't make you an intellectual, it just makes you depressed.",
                f"This music collection looks like it was designed entirely by a Pitchfork editorial board."
            ]
        elif style == 'condescending':
            roasts = [
                f"Oh look, you listen to {artists_name[0]}. How incredibly brave and unique of you.",
                f"I too remember when I discovered {tracks_name[0]} and made it my entire personality.",
                f"Your taste is so basic that even the Spotify algorithm is bored of recommending it."
            ]
        else:
            roasts = [
                f"Autotune and synthesizers. Real music died when guitar solos went out of fashion.",
                f"You listen to {artists_name[0]}? Back in my day, musicians actually played their own instruments.",
                f"None of these songs would survive five minutes at Woodstock without a backing track."
            ]
        roast_text = random.choice(roasts).upper()
    else:
        try:
            system_instructions = {
                'elitist': "You are a hostile, underground music critic who despises mainstream success and corporate algorithms.",
                'condescending': "You are a pretentious, eye-rolling hipster record store clerk who finds the user's taste painfully basic, cliché, and uninspired.",
                'boomer': "You are an out-of-touch, old-school rock purist. You believe music died in 1979 and that synthesizers, autotune, and modern pop are absolute garbage."
            }

            persona = system_instructions.get(style, system_instructions['elitist'])

            prompt = f"""
SYSTEM: {persona}
INPUT:
- Top Artists: {artists_name}
- Top Tracks: {tracks_name}
TASK: Write a single, devastating roast based on this music taste.
STRICT RULE: Maximum 15 words total.
STRICT RULE: NO markdown, NO bolding, NO asterisks, NO emojis.
STRICT RULE: One sentence only.
STRICT RULE: Be extremely specific to the inputs.
"""
            print(f"DEBUG: Sending to Gemini -> style={style}, time_range={time_range}, inputs={artists_name + tracks_name}")
            
            response = client.models.generate_content(
               model="gemini-2.5-flash",
               contents=prompt
            )
            roast_text = response.text
        except Exception as ge:
            print(f"Gemini API failed: {ge}. Using mock roast.")
            import random
            roast_text = "GEMINI ERROR: " + random.choice([
                "YOUR taste is so bad it broke the artificial intelligence.",
                "Even our advanced machine learning models cannot process this musical trash.",
                "Error 500: Taste too generic to compute a roast."
            ])

    return {
        "artists": artists_name,
        "tracks": tracks_name,
        "roast": roast_text,
        "demo": is_mock
    }

import os
import dotenv
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()

scope = 'user-top-read user-read-recently-played user-library-read playlist-read-private'

#Connection To spotify
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=os.getenv("SPOTIPY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
    scope=scope
))

print("Connecting to Spotify...")
try:
    results = sp.current_user_top_artists(limit=5, time_range='short_term')
    print("\n--- YOUR TOP ARTISTS ---")
    for rank, artist_data in enumerate(results['items']):
        name = artist_data['name']
        #Learning: If name too long 
        display_name = f"{name[0:10]}..." if len(name) > 10 else name
        print(f"{rank + 1:02d} | {display_name}")
       # The Advanced way:
       #artist_names = [artist['name'] for artist in results['items']]

except Exception as e:
    print(f"Something went wrong: {e}")


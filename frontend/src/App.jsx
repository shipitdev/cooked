import { useState } from 'react';
import axios from 'axios';

function App() {
  const [artists, setArtists] = useState([]);
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);

  // We moved the logic here. It only runs when the button is clicked.
  const handleRoast = async () => {
    setLoading(true);
    setRoast(""); // Clear previous roast
    try {
      const response = await axios.get("http://127.0.0.1:8000/roast-me");
      setArtists(response.data.artists || []);
      setRoast(response.data.roast || "No roast found.");
    } catch (error) {
      console.error("Error fetching data:", error);
      setRoast("The kitchen is closed (API Error). Check your terminal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'white', backgroundColor: '#121212', minHeight: '100vh', fontFamily: 'Courier New, monospace' }}>
      <h1 style={{ borderBottom: '4px solid white', display: 'inline-block', letterSpacing: '2px' }}>COOKED.in</h1>
      
      <div style={{ margin: '40px 0' }}>
        <button 
          onClick={handleRoast} 
          disabled={loading}
          style={{
            padding: '15px 30px',
            backgroundColor: loading ? '#555' : '#ff4d4d',
            color: 'white',
            border: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase'
          }}
        >
          {loading ? "COOKING..." : "GENERATE ROAST"}
        </button>
      </div>

      {roast && (
        <div style={{ maxWidth: '600px', margin: '0 auto', border: '2px solid #ff4d4d', padding: '20px' }}>
          <p style={{ fontSize: '1.5rem', color: '#ff4d4d', margin: '0' }}>
            "{roast}"
          </p>
        </div>
      )}

      <h3 style={{ marginTop: '40px' }}>YOUR TOP ARTISTS:</h3>
      {artists && artists.length > 0 ? (
        artists.map((name, index) => (
          <p key={index} style={{ fontSize: '1.1rem', opacity: '0.8' }}>
            {index + 1}. {name.toUpperCase()}
          </p>
        ))
      ) : (
        !loading && <p>Nothing here yet. Click the button above.</p>
      )}
    </div>
  );
}

export default App;
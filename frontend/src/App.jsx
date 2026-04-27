import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [artists, setArtists] = useState([]);
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);

  const getCooked = async () => {
    setLoading(true);
    setRoast(""); 
    try {
      const res = await axios.get("http://127.0.0.1:8000/roast-me");
      const cleanRoast = (res.data.roast || "").replace(/\*\*/g, "").toUpperCase();
      setArtists(res.data.artists || []);
      setRoast(cleanRoast);
    } catch {
      setRoast("BACKEND_OFFLINE_RETRY_CONNECTION");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 flex flex-col gap-1">
      <div className="module-border flex justify-between items-center px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
        <span>STATUS</span>
        <div className="flex gap-6">
          <span>Spotify Feed: <span className="text-[#1DB954]">Connected [●]</span></span>
          <span>Roast Engine.. [{loading ? "Busy" : "Idle"}]</span>
        </div>
      </div>

      
      <div className="module-border p-6 flex items-baseline">
        <h1 className="text-[12vw] font-display font-black leading-none tracking-tighter uppercase italic">
          COOKED<span className="text-violet-600 not-italic">.</span>
        </h1>
        <div className="ml-auto w-12 h-12 bg-white" /> {/* The square block at the end */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-1 flex-grow">
        
        <div className="md:col-span-5 flex flex-col gap-1">
          <div className="module-border flex flex-grow">
            <div className="side-label">ARTISTS</div>
            <div className="p-6 space-y-2">
              {artists.length > 0 ? artists.map((name, i) => (
                <p key={i} className="text-4xl font-display font-black uppercase leading-none tracking-tight">
                  {name}
                </p>
              )) : <p className="opacity-20 italic">Waiting_for_ingestion...</p>}
            </div>
          </div>

          <div className="module-border flex h-32">
            <div className="side-label text-[8px]">LOGS</div>
            <div className="p-3 text-[8px] opacity-60 leading-tight uppercase">
              Spotify Feed: {loading ? 'Active' : 'Idle'} <br/>
              Recovered Start: SDTATA881-556-B01:01:0027W3820 <br/>
              Engine_V4_Status: OK <br/>
               Pune_Terminal_Session_Logged
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-1">
          
          <div className="module-border p-1 bg-white">
            <button 
              onClick={getCooked}
              disabled={loading}
              className="w-full py-10 border-2 border-black text-black hover:bg-violet-600 hover:text-white transition-all"
            >
              <span className="text-6xl font-display font-black uppercase">
                {loading ? "FRYING..." : "EXECUTE ROAST"}
              </span>
            </button>
            <div className="h-2 bg-black w-full mt-1 relative overflow-hidden">
               {loading && <motion.div animate={{x: ['-100%', '100%']}} transition={{repeat: Infinity, duration: 1}} className="absolute top-0 left-0 h-full w-1/2 bg-violet-600" />}
            </div>
          </div>

          <div className="module-border flex flex-grow bg-[#0c0c0c]">
            <div className="side-label">Verdict</div>
            <div className="p-8 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {roast ? (
                  <motion.p 
                    key={roast}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-4xl md:text-5xl font-black italic text-violet-500 leading-none uppercase tracking-tighter"
                  >
                    {roast}
                  </motion.p>
                ) : (
                  <p className="text-white/10 italic text-2xl">Awaiting commands...</p>
                )}
              </AnimatePresence>
              
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-1 h-1 bg-violet-600" />
                <div className="w-1 h-1 bg-violet-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
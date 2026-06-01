import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

function App() {
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [roast, setRoast] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("long_term");
  const [criticStyle, setCriticStyle] = useState("elitist");
  const [demoMode, setDemoMode] = useState(false);

  const getCooked = async () => {
    setLoading(true);
    setRoast("");
    setError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/roast-me`, {
        params: {
          time_range: timeRange,
          style: criticStyle
        }
      });
      const cleanRoast = (res.data.roast || "").replace(/\*\*/g, "").toUpperCase();
      setArtists(res.data.artists || []);
      setTracks(res.data.tracks || []);
      setRoast(cleanRoast);
      setDemoMode(!!res.data.demo);
    } catch {
      setArtists([]);
      setTracks([]);
      setDemoMode(true);
      setError("BACKEND_OFFLINE_RETRY_CONNECTION");
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
        <div className="ml-auto w-12 h-12 bg-white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-1 flex-grow">
        
        {/* COLUMN 1: Config & Logs */}
        <div className="md:col-span-4 flex flex-col gap-1">
          <div className="module-border flex flex-col flex-grow">
            <div className="flex flex-1">
              <div className="side-label">CONFIG</div>
              <div className="p-4 flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="text-[10px] tracking-wider text-white/50 uppercase font-bold">TIME RANGE</div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { label: "4 WEEKS", value: "short_term" },
                      { label: "6 MONTHS", value: "medium_term" },
                      { label: "ALL TIME", value: "long_term" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTimeRange(opt.value)}
                        className={`text-[9px] font-bold py-2 border uppercase tracking-wider transition-all cursor-pointer ${
                          timeRange === opt.value
                            ? "bg-white text-black border-white"
                            : "border-white/30 text-white hover:bg-white/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] tracking-wider text-white/50 uppercase font-bold">CRITIC STYLE</div>
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      { label: "ELITIST CRITIC", value: "elitist" },
                      { label: "CONDESCENDING HIPSTER", value: "condescending" },
                      { label: "BOOMER ROCK PURIST", value: "boomer" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCriticStyle(opt.value)}
                        className={`text-[9px] font-bold py-2 px-3 border uppercase tracking-wider text-left transition-all cursor-pointer ${
                          criticStyle === opt.value
                            ? "bg-violet-600 text-white border-violet-600"
                            : "border-white/30 text-white hover:bg-white/10"
                        }`}
                      >
                        [●] {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="module-border flex h-36">
            <div className="side-label text-[8px]">LOGS</div>
            <div className="p-3 text-[8px] opacity-60 leading-tight uppercase flex-grow">
              Spotify Feed: {demoMode ? "DEMO_MODE (PLACEHOLDERS)" : "CONNECTED"} <br/>
              Target Period: {timeRange.toUpperCase()} <br/>
              Engine Mode: {criticStyle.toUpperCase()} <br/>
              Status: {error || (loading ? 'Active' : 'Idle')} <br/>
              {demoMode ? (
                <span className="text-amber-400 font-bold block mt-1">[WARN] SETUP .ENV FOR LIVE SPOTIFY</span>
              ) : (
                <span>Recovered Session: OK_SYS_3820</span>
              )}
              Pune_Terminal_Session_Logged
            </div>
          </div>
        </div>

        {/* COLUMN 2: Ingested Data (Artists & Tracks) */}
        <div className="md:col-span-4 flex flex-col gap-1">
          <div className="module-border flex flex-1 flex-col">
            <div className="flex flex-1">
              <div className="side-label">ARTISTS</div>
              <div className="p-4 space-y-2 flex-grow overflow-y-auto max-h-[25vh] md:max-h-[30vh]">
                {artists.length > 0 ? artists.map((name, i) => (
                  <p key={i} className="text-xl font-display font-black uppercase leading-none tracking-tight">
                    {i+1}. {name}
                  </p>
                )) : <p className="opacity-20 italic text-xs">Waiting_for_ingestion...</p>}
              </div>
            </div>
          </div>

          <div className="module-border flex flex-1 flex-col">
            <div className="flex flex-1">
              <div className="side-label">TRACKS</div>
              <div className="p-4 space-y-2 flex-grow overflow-y-auto max-h-[25vh] md:max-h-[30vh]">
                {tracks.length > 0 ? tracks.map((name, i) => (
                  <p key={i} className="text-xl font-display font-black uppercase leading-none tracking-tight">
                    {i+1}. {name}
                  </p>
                )) : <p className="opacity-20 italic text-xs">Waiting_for_ingestion...</p>}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Execute & Verdict */}
        <div className="md:col-span-4 flex flex-col gap-1">
          <div className="module-border p-1 bg-white">
            <button 
              onClick={getCooked}
              disabled={loading}
              className="w-full py-6 border-2 border-black text-black hover:bg-violet-600 hover:text-white transition-all cursor-pointer"
            >
              <span className="text-3xl font-display font-black uppercase">
                {loading ? "FRYING..." : "EXECUTE ROAST"}
              </span>
            </button>
            <div className="h-2 bg-black w-full mt-1 relative overflow-hidden">
               {loading && <motion.div animate={{x: ['-100%', '100%']}} transition={{repeat: Infinity, duration: 1}} className="absolute top-0 left-0 h-full w-1/2 bg-violet-600" />}
            </div>
          </div>

          <div className="module-border flex flex-grow bg-[#0c0c0c]">
            <div className="side-label">Verdict</div>
            <div className="p-6 flex flex-col justify-center relative flex-grow">
              <AnimatePresence mode="wait">
                {roast ? (
                  <motion.p 
                    key={roast}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-2xl md:text-3xl font-black italic text-violet-500 leading-none uppercase tracking-tighter"
                  >
                    {roast}
                  </motion.p>
                ) : (
                  <p className="text-white/10 italic text-xl">Awaiting commands...</p>
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

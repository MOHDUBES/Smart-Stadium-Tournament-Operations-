import { Suspense, lazy, useState } from 'react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { Map, Cuboid as Cube, Navigation, MapPin } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapRouter } from './MapRouter';

const StadiumMap3D = lazy(() => import('./StadiumMap3D'));

// Locations preset for routing demo
const LOCATIONS: Record<string, [number, number]> = {
  'My Location (Dubai Marina)': [25.0805, 55.1403],
  'Dubai Mall': [25.1972, 55.2744],
  'Stadium Main Gate (Gate A)': [25.276987, 55.296249],
  'VIP Lounge': [25.277500, 55.297000],
  'Fan Seat (Block B, Row 4)': [25.276000, 55.295500],
};

const StadiumMap: React.FC = () => {
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'3d' | 'google'>('3d');
  
  // Routing State
  const [isRoutingMode, setIsRoutingMode] = useState(false);
  const [fromLocation, setFromLocation] = useState<string>('My Location (Dubai Marina)');
  const [toLocation, setToLocation] = useState<string>('Stadium Main Gate (Gate A)');

  // Determine if it's road or internal
  const routingType = (fromLocation.includes('Seat') || fromLocation.includes('Gate') || fromLocation.includes('VIP')) && 
                      (toLocation.includes('Seat') || toLocation.includes('Gate') || toLocation.includes('VIP')) 
                      ? 'internal' : 'road';

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-5 border-b border-white/10 pb-2">
        <h2 className="text-xl font-semibold text-brand-text">
          {t.stadiumMap || "Live Stadium Map"}
        </h2>
        <div className="flex gap-2" role="group" aria-label="Map view mode">
          <button 
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === '3d' ? 'bg-brand-teal text-brand-dark' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            aria-label="Switch to 3D View"
            aria-pressed={viewMode === '3d'}
          >
            <Cube size={16} aria-hidden="true" /> 3D View
          </button>
          <button 
            onClick={() => setViewMode('google')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'google' ? 'bg-brand-teal text-brand-dark' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            aria-label="Switch to Map View"
            aria-pressed={viewMode === 'google'}
          >
            <Map size={16} aria-hidden="true" /> Map
          </button>
        </div>
      </div>
      
      <Suspense fallback={
        <div className="flex-1 w-full flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <div className="flex-1 w-full relative min-h-[300px] overflow-hidden rounded-xl border border-white/5" style={{ zIndex: 0 }}>
          
          {/* Routing Panel Toggle */}
          {viewMode === 'google' && (
            <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
               <button 
                 onClick={() => setIsRoutingMode(!isRoutingMode)} 
                 className={`py-2 px-4 shadow-lg rounded-full flex items-center gap-2 font-medium transition-all text-sm ${isRoutingMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-brand-teal text-brand-dark hover:bg-brand-teal/90'}`}
               >
                 <Navigation size={16} /> {isRoutingMode ? "Close Navigation" : "Get Directions"}
               </button>
            </div>
          )}

          {/* Floating Routing Panel */}
          {viewMode === 'google' && isRoutingMode && (
            <div className="absolute top-16 right-4 z-[400] bg-brand-dark/95 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl w-80 animate-in fade-in slide-in-from-top-4 duration-300">
               <h3 className="text-white font-medium mb-4 flex items-center gap-2"><MapPin size={16} className="text-brand-teal"/> Navigation Router</h3>
               <div className="flex flex-col gap-3">
                 <div>
                   <label className="text-xs text-white/50 mb-1 block font-medium">From</label>
                   <select className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all" value={fromLocation} onChange={e => setFromLocation(e.target.value)}>
                     {Object.keys(LOCATIONS).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="text-xs text-white/50 mb-1 block font-medium">To</label>
                   <select className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all" value={toLocation} onChange={e => setToLocation(e.target.value)}>
                     {Object.keys(LOCATIONS).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                   </select>
                 </div>
                 <div className="text-xs text-brand-teal mt-3 bg-brand-teal/10 p-2.5 rounded-lg border border-brand-teal/20">
                    <strong>Mode:</strong> {routingType === 'road' ? '🚗 GPS Road Routing' : '🚶 Internal Stadium Walking'}
                 </div>
               </div>
            </div>
          )}

          {viewMode === '3d' ? (
            <StadiumMap3D />
          ) : (
            <MapContainer 
              center={[25.1900, 55.2200]} 
              zoom={11} 
              style={{ height: '100%', width: '100%', backgroundColor: '#1a1f2c' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {isRoutingMode && <MapRouter fromPoint={LOCATIONS[fromLocation]} toPoint={LOCATIONS[toLocation]} routingType={routingType} />}
            </MapContainer>
          )}
        </div>
      </Suspense>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-teal shadow-[0_0_8px_#2FBF9F]" />
          <span className="text-sm text-brand-text/60 font-medium">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
          <span className="text-sm text-brand-text/60 font-medium">Crowded</span>
        </div>
      </div>
    </div>
  );
};

export default StadiumMap;

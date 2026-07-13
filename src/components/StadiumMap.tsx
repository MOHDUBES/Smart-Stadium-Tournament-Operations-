import { Suspense, lazy, useState } from 'react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { Map, Cuboid as Cube } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const StadiumMap3D = lazy(() => import('./StadiumMap3D'));

const StadiumMap: React.FC = () => {
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'3d' | 'google'>('3d');

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
          {viewMode === '3d' ? (
            <StadiumMap3D />
          ) : (
            <MapContainer 
              center={[25.276987, 55.296249]} 
              zoom={15} 
              style={{ height: '100%', width: '100%', backgroundColor: '#1a1f2c' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
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

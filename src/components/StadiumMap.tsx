import { Suspense, lazy, useState } from 'react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { Map, Cuboid as Cube } from 'lucide-react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const StadiumMap3D = lazy(() => import('./StadiumMap3D'));

const containerStyle = { width: '100%', height: '100%', borderRadius: '0.75rem' };
const center = { lat: 25.276987, lng: 55.296249 }; // Example coordinate

const StadiumMap: React.FC = () => {
  const language = useAppStore((state) => state.language);
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'3d' | 'google'>('3d');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "MOCK_API_KEY_FOR_DEMO" // Replace with actual API key in production
  });

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
        <div className="flex-1 w-full relative min-h-[300px] overflow-hidden rounded-xl border border-white/5">
          {viewMode === '3d' ? (
            <StadiumMap3D />
          ) : (
            isLoaded ? (
              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15} options={{ styles: [{ elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }, { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }] }}>
                {/* Map markers would go here */}
              </GoogleMap>
            ) : <div className="text-white/50 text-center pt-20">Loading Map...</div>
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

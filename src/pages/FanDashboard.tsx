import React, { useState, useEffect } from 'react';
import AIChatWidget from '../components/AIChatWidget';
import StadiumMap from '../components/StadiumMap';
import SustainabilityModule from '../components/SustainabilityModule';
import { LogOut, MapPin, Coffee, Info, Lightbulb, Navigation } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import AnimatedCounter from '../components/AnimatedCounter';

interface Props {
  onLogout: () => void;
}

const FanDashboard: React.FC<Props> = ({ onLogout }) => {
  const { stadiumData, language, setExternalChatQuery } = useAppStore();
  const t = translations[language];
  const [loading, setLoading] = useState(true);
  const [wheelchairAccess, setWheelchairAccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChatAction = (query: string) => {
    setExternalChatQuery(query);
    setTimeout(() => {
      document.getElementById('ai-chat-widget')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6" role="main">
      <header className="flex justify-between items-center mb-6 bg-black/30 p-4 md:p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent">
          PitchMind {t.fanTitle}
        </h1>
        <button className="btn btn-glass" onClick={onLogout} aria-label={t.changeRole}>
          <LogOut size={16} className="rtl:-scale-x-100" aria-hidden="true" />
          <span className="hidden sm:inline">{t.changeRole}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TiltCard className="glass-panel p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-5 text-brand-text border-b border-white/10 pb-2">
                  {t.matchInfo}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleChatAction('Where is my seat?')}
                    className="btn btn-glass justify-start w-full group py-4"
                    aria-label={t.seatFinder}
                  >
                    <MapPin
                      size={20}
                      className="text-blue-400 group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                    />
                    <span className="ms-2">{t.seatFinder}</span>
                  </button>
                  <button
                    onClick={() => handleChatAction('Where is the nearest food stall?')}
                    className="btn btn-glass justify-start w-full group py-4"
                    aria-label={t.foodDrinks}
                  >
                    <Coffee
                      size={20}
                      className="text-amber-400 group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                    />
                    <span className="ms-2">{t.foodDrinks}</span>
                  </button>
                  <button
                    onClick={() => handleChatAction('Show me the match stats')}
                    className="btn btn-glass justify-start w-full group py-4"
                    aria-label={t.matchStats}
                  >
                    <Info
                      size={20}
                      className="text-brand-green group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                    />
                    <span className="ms-2">{t.matchStats}</span>
                  </button>
                  <div className="flex flex-col gap-2 relative">
                    <button
                      onClick={() => setWheelchairAccess(!wheelchairAccess)}
                      className={`btn w-full justify-start ${wheelchairAccess ? 'bg-brand-teal text-brand-dark shadow-[0_0_15px_rgba(47,191,159,0.4)]' : 'btn-glass'} py-4 group`}
                      aria-pressed={wheelchairAccess}
                    >
                      <Navigation
                        size={20}
                        className={`${wheelchairAccess ? 'text-brand-dark' : 'text-brand-text group-hover:scale-110 transition-transform'}`}
                      />
                      <span className="ms-2">{t.accessibleRoute}</span>
                    </button>
                    {wheelchairAccess && (
                      <span className="absolute -bottom-5 left-0 right-0 text-xs text-brand-teal text-center animate-pulse">
                        Routes highlighted
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <SustainabilityModule />
              </div>
            </TiltCard>

            <StadiumMap />
          </div>

          <TiltCard className="glass-panel p-6" aria-live="polite">
            <div className="flex justify-between items-center mb-5 border-b border-white/10 pb-2">
              <h2 className="text-xl font-semibold text-brand-text">{t.liveWaitTimes}</h2>
              <button
                onClick={() =>
                  handleChatAction('Give me live AI insights on stadium wait times and crowds.')
                }
                className="btn btn-glass py-1 px-3 text-brand-teal text-sm font-medium hover:bg-brand-teal/10"
                aria-label={t.aiInsights}
              >
                <Lightbulb size={16} aria-hidden="true" /> {t.aiInsights}
              </button>
            </div>

            {/* AI Prediction Banner */}
            <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-xl p-4 mb-4 text-brand-text flex items-start gap-3">
              <Lightbulb size={20} className="text-brand-teal shrink-0 mt-0.5" />
              <p className="text-sm">{t.waitPrediction}</p>
            </div>

            <ul className="flex flex-col gap-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center p-4 bg-black/20 border border-white/5 rounded-xl"
                  >
                    <div className="h-5 w-32 skeleton rounded-md" />
                    <div className="h-5 w-16 skeleton rounded-md" />
                  </li>
                ))
              ) : (
                <>
                  {stadiumData.gates.slice(0, 2).map((gate) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={gate.id}
                      className="flex justify-between items-center p-4 bg-black/20 border border-white/5 rounded-xl hover:bg-black/40 transition-colors"
                    >
                      <span className="font-medium text-brand-text">
                        {gate.name}
                        {wheelchairAccess && (
                          <span className="ml-2 text-xs bg-brand-teal text-brand-dark px-2 py-0.5 rounded-full">
                            Elevator Route
                          </span>
                        )}
                      </span>
                      <div
                        className={`font-bold px-3 py-1 rounded-md bg-black/50 ${gate.waitTimeMinutes < 10 ? 'text-brand-green' : 'text-amber-400'}`}
                      >
                        ~<AnimatedCounter value={gate.waitTimeMinutes} /> {t.mins}
                      </div>
                    </motion.li>
                  ))}
                </>
              )}
            </ul>
          </TiltCard>
        </div>

        <div className="lg:col-span-1">
          <AIChatWidget role="fan" />
        </div>
      </div>
    </div>
  );
};

export default FanDashboard;

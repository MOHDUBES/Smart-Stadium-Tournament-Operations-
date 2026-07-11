import React, { useState, useEffect } from 'react';
import AIChatWidget from '../components/AIChatWidget';
import StadiumMap from '../components/StadiumMap';
import IncidentForm from '../components/IncidentForm';
import { LogOut, Activity, Users, Radio, AlertCircle, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { getWorstWaitTimeGate } from '../utils/stadiumUtils';

interface Props {
  onLogout: () => void;
}

const OrganizerDashboard: React.FC<Props> = ({ onLogout }) => {
  const { stadiumData, language, setExternalChatQuery } = useAppStore();
  const t = translations[language];
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const worstGate = getWorstWaitTimeGate(stadiumData.gates) || stadiumData.gates[0];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6" role="main">
      <header className="flex justify-between items-center mb-8 bg-black/30 p-4 md:p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          PitchMind {t.orgTitle}
        </h1>
        <button className="btn btn-glass" onClick={onLogout} aria-label={t.changeRole}>
          <LogOut size={16} className="rtl:-scale-x-100" aria-hidden="true" />
          <span className="hidden sm:inline">{t.changeRole}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TiltCard className="glass-panel p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text/60 mb-1">{t.totalCrowd}</p>
                <div className="text-3xl font-bold text-brand-text"><AnimatedCounter value={stadiumData.overallCrowd.totalFans} /></div>
              </div>
              <div className="bg-brand-teal/20 p-4 rounded-xl">
                <Users size={28} className="text-brand-teal" />
              </div>
            </TiltCard>
            <TiltCard className="glass-panel p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text/60 mb-1">{t.liveIncidents}</p>
                <div className="text-3xl font-bold text-amber-500"><AnimatedCounter value={stadiumData.incidents.length} /></div>
              </div>
              <div className="bg-amber-500/20 p-4 rounded-xl">
                <AlertTriangle size={28} className="text-amber-500" />
              </div>
            </TiltCard>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6" aria-live="polite">
            <TiltCard className="glass-panel p-6 border-b-4 border-b-amber-500">
              <div className="flex items-center gap-2 text-brand-text/60 font-medium mb-4">
                <Activity size={20} className="text-amber-500" aria-hidden="true" />
                <h2>{t.highestWait}</h2>
              </div>
              {loading ? (
                <>
                  <div className="h-10 w-24 skeleton rounded-lg mb-2" />
                  <div className="h-5 w-32 skeleton rounded" />
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="text-4xl font-bold mb-1 text-brand-text">
                    <AnimatedCounter value={worstGate.waitTimeMinutes} /> <span className="text-xl font-normal text-brand-text/60">{t.mins}</span>
                  </div>
                  <div className="text-amber-400 text-sm font-medium">
                    at {worstGate.name}
                  </div>
                </motion.div>
              )}
            </TiltCard>

            <TiltCard>
              <StadiumMap />
            </TiltCard>
          </section>

          <TiltCard className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4 text-brand-text border-b border-white/10 pb-2">{t.broadcastAlert}</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                aria-label={t.broadcastAlert}
                className="flex-1 bg-black/40 border border-brand-text/10 rounded-xl px-4 py-3 text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                placeholder="Enter message for all staff/fans..."
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
              />
              <button
                className="btn bg-gradient-to-br from-amber-500 to-orange-600 text-brand-dark shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] px-6"
                aria-label={t.broadcastAlert}
                onClick={() => {
                  if (broadcastMsg.trim()) {
                    setExternalChatQuery(`Broadcast alert: ${broadcastMsg}`);
                    setBroadcastMsg('');
                    setBroadcastSuccess(true);
                    setTimeout(() => setBroadcastSuccess(false), 3000);
                  }
                }}
              >
                <Radio size={18} aria-hidden="true" /> <span className="ms-1">{t.send}</span>
              </button>
            </div>
            <AnimatePresence>
              {broadcastSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-brand-green text-sm flex items-center gap-2 bg-brand-green/10 p-2 rounded-lg border border-brand-green/20">
                  <Activity size={16} /> Broadcast successfully sent to all channels.
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>

          <TiltCard className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4 text-brand-text border-b border-white/10 pb-2">Tournament Operations & Schedule</h2>
            <div className="flex flex-col gap-3">
               <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                 <div>
                   <h3 className="text-brand-text font-medium">Quarter Final: Team A vs Team B</h3>
                   <p className="text-brand-text/60 text-sm">Today, 18:00 • Main Stadium</p>
                 </div>
                 <span className="text-brand-green text-sm px-2 py-1 bg-brand-green/10 rounded border border-brand-green/20">On Schedule</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                 <div>
                   <h3 className="text-brand-text font-medium">Semi Final: Team C vs Team D</h3>
                   <p className="text-brand-text/60 text-sm">Tomorrow, 20:00 • Main Stadium</p>
                 </div>
                 <span className="text-amber-500 text-sm px-2 py-1 bg-amber-500/10 rounded border border-amber-500/20">Pending</span>
               </div>
            </div>
          </TiltCard>

          <AnimatePresence>
            {showIncidentForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <IncidentForm onClose={() => setShowIncidentForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <TiltCard className="glass-panel p-6">
            <div className="flex justify-between items-center mb-5 border-b border-white/10 pb-2">
              <h2 className="text-xl font-semibold text-brand-text">{t.liveIncidents}</h2>
              <button onClick={() => setShowIncidentForm(!showIncidentForm)} className="btn btn-glass py-1 px-3 text-sm" aria-label={t.reportIncident} aria-expanded={showIncidentForm}>
                <AlertTriangle size={14} className="text-red-500" aria-hidden="true" /> {t.reportIncident}
              </button>
            </div>
            <ul className="flex flex-col gap-3">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <li key={i} className="flex gap-4 p-4 bg-black/20 border border-white/5 rounded-xl">
                    <div className="w-5 h-5 skeleton rounded-full mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 w-48 skeleton rounded mb-2" />
                      <div className="h-4 w-32 skeleton rounded" />
                    </div>
                  </li>
                ))
              ) : (
                stadiumData.incidents.map(inc => (
                  <motion.li initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={inc.id} className="flex gap-4 p-4 bg-black/20 border border-white/5 rounded-xl">
                    <div className="mt-1">
                      <AlertCircle size={22} className={inc.status === 'active' ? 'text-red-500 animate-pulse' : 'text-brand-green'} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-brand-text">{inc.title}</h3>
                      <p className="text-brand-text/60 text-sm capitalize mt-1">{inc.type} • {inc.status}</p>
                      <span className="text-xs font-medium text-brand-text/40 bg-black/40 px-2 py-0.5 rounded-full mt-2 inline-block">{inc.timeAgo}</span>
                    </div>
                  </motion.li>
                ))
              )}
            </ul>
          </TiltCard>
        </div>

        <div className="lg:col-span-1">
          <AIChatWidget role="organizer" />
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;

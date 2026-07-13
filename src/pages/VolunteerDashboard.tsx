import React, { useState, useEffect } from 'react';
import AIChatWidget from '../components/AIChatWidget';
import TranslationWidget from '../components/TranslationWidget';
import IncidentForm from '../components/IncidentForm';
import { LogOut, CheckSquare, AlertTriangle, Map } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from '../components/TiltCard';

interface Props {
  onLogout: () => void;
}

const VolunteerDashboard: React.FC<Props> = ({ onLogout }) => {
  const { tasks, toggleTask, language, setExternalChatQuery, stadiumData } = useAppStore();
  const t = translations[language];
  const [loading, setLoading] = useState(true);
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleChatAction = (query: string) => {
    setExternalChatQuery(query);
    setTimeout(() => {
      document.getElementById('ai-chat-widget')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTaskKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTask(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6" role="main">
      <header className="flex justify-between items-center mb-6 bg-black/30 p-4 md:p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-green to-brand-text bg-clip-text text-transparent">
          PitchMind {t.volTitle}
        </h1>
        <button className="btn btn-glass" onClick={onLogout} aria-label={t.changeRole}>
          <LogOut size={16} className="rtl:-scale-x-100" aria-hidden="true" />
          <span className="hidden sm:inline">{t.changeRole}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TiltCard className="glass-panel p-6 flex flex-col">
              <h2 className="text-xl font-semibold text-brand-text">
                {t.zoneAssignment}: North (Gate 1)
              </h2>
              <p className="text-brand-text/60 mt-1 mb-6">Active Shift: 14:00 - 20:00</p>

              <div className="flex flex-wrap gap-4 mt-auto">
                <button
                  className="btn btn-primary"
                  aria-label={t.reportIncident}
                  onClick={() => setShowIncidentForm(!showIncidentForm)}
                >
                  <AlertTriangle size={18} aria-hidden="true" />{' '}
                  <span className="ms-1">{t.reportIncident}</span>
                </button>
                <button
                  onClick={() => handleChatAction('Show me the stadium map for my zone')}
                  className="btn btn-glass"
                  aria-label={t.viewMap}
                >
                  <Map size={18} aria-hidden="true" /> <span className="ms-1">{t.viewMap}</span>
                </button>
              </div>
            </TiltCard>

            <TranslationWidget />
          </div>

          <AnimatePresence>
            {showIncidentForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <IncidentForm onClose={() => setShowIncidentForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submitted Incidents List */}
          {stadiumData.incidents.length > 0 && (
            <TiltCard className="glass-panel p-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-xl font-semibold mb-5 text-brand-text border-b border-white/10 pb-2">
                Recent Reports
              </h2>
              <div className="flex flex-col gap-3">
                {stadiumData.incidents.slice(0, 3).map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 bg-black/20 border border-brand-teal/20 rounded-xl flex items-center justify-between shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-teal/20 p-2 rounded-lg">
                        <AlertTriangle size={18} className="text-brand-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-text">{incident.title}</p>
                        <p className="text-xs text-brand-teal capitalize">
                          {incident.type} • {incident.status}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-brand-text/50 bg-black/40 px-2 py-1 rounded-md">
                      {incident.timeAgo}
                    </span>
                  </div>
                ))}
              </div>
            </TiltCard>
          )}

          <TiltCard className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-5 text-brand-text border-b border-white/10 pb-2">
              {t.taskChecklist}
            </h2>
            <ul className="flex flex-col gap-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 p-4 bg-black/20 border border-white/5 rounded-xl"
                    >
                      <div className="w-5 h-5 skeleton rounded" />
                      <div className="h-5 w-48 skeleton rounded-md" />
                    </li>
                  ))
                : tasks.map((task) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={task.id}
                      role="checkbox"
                      aria-checked={task.completed}
                      tabIndex={0}
                      onKeyDown={(e) => handleTaskKeyDown(e, task.id)}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                        task.completed
                          ? 'bg-brand-green/10 border-brand-green/30 opacity-70'
                          : 'bg-black/20 border-white/5 hover:bg-black/40'
                      }`}
                    >
                      <CheckSquare
                        size={22}
                        className={task.completed ? 'text-brand-green' : 'text-brand-text/40'}
                        aria-hidden="true"
                      />
                      <span
                        className={`font-medium ${task.completed ? 'line-through text-brand-text/50' : 'text-brand-text'}`}
                      >
                        {task.text}
                      </span>
                    </motion.li>
                  ))}
            </ul>
          </TiltCard>
        </div>

        <div className="lg:col-span-1">
          <AIChatWidget role="volunteer" />
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

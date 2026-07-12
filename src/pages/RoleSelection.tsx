import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Ticket, Users, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import type { UserRole } from '../types';
import { translations } from '../data/translations';
import React, { lazy, Suspense } from 'react';
import TiltCard from '../components/TiltCard';

const Logo3D = lazy(() => import('../components/Logo3D'));

const RoleSelection: React.FC = () => {
  const setRole = useAppStore((state) => state.setRole);
  const language = useAppStore((state) => state.language);
  const t = translations[language];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const handleKeyDown = (e: React.KeyboardEvent, role: UserRole) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setRole(role);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <main className="text-center max-w-5xl w-full" aria-labelledby="welcome-title">
        <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="flex flex-col items-center mb-8">
          <Suspense fallback={<div className="w-32 h-32 mx-auto mb-6 skeleton rounded-full" />}>
            <Logo3D />
          </Suspense>
          <h1 id="welcome-title" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-br from-brand-teal to-brand-green bg-clip-text text-transparent">
            {t.welcome}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-2">{t.subtitle}</p>
          <p className="text-brand-text/80 mb-12" aria-live="polite">{t.selectRole}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          role="list"
        >
          <motion.div variants={itemVariants} role="listitem">
            <TiltCard
              role="button"
              tabIndex={0}
              aria-label={`Select ${t.fanTitle} role`}
              onClick={() => setRole('fan')}
              onKeyDown={(e) => handleKeyDown(e, 'fan')}
              className="glass-panel p-8 cursor-pointer flex flex-col items-center group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal active:scale-95"
            >
              <div className="bg-brand-teal/10 p-6 rounded-full mb-6 group-hover:scale-110 group-hover:bg-brand-teal/20 transition-all duration-300 shadow-[0_0_15px_rgba(47,191,159,0.2)] group-hover:shadow-[0_0_25px_rgba(47,191,159,0.4)]">
                <Ticket size={48} className="text-brand-teal" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-brand-text">{t.fanTitle}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{t.fanDesc}</p>
            </TiltCard>
          </motion.div>

          <motion.div variants={itemVariants} role="listitem">
            <TiltCard
              role="button"
              tabIndex={0}
              aria-label={`Select ${t.volTitle} role`}
              onClick={() => setRole('volunteer')}
              onKeyDown={(e) => handleKeyDown(e, 'volunteer')}
              className="glass-panel p-8 cursor-pointer flex flex-col items-center group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal active:scale-95"
            >
              <div className="bg-brand-green/10 p-6 rounded-full mb-6 group-hover:scale-110 group-hover:bg-brand-green/20 transition-all duration-300 shadow-[0_0_15px_rgba(126,217,87,0.2)] group-hover:shadow-[0_0_25px_rgba(126,217,87,0.4)]">
                <Users size={48} className="text-brand-green" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-brand-text">{t.volTitle}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{t.volDesc}</p>
            </TiltCard>
          </motion.div>

          <motion.div variants={itemVariants} role="listitem" className="sm:col-span-2 lg:col-span-1">
            <TiltCard
              role="button"
              tabIndex={0}
              aria-label={`Select ${t.orgTitle} role`}
              onClick={() => setRole('organizer')}
              onKeyDown={(e) => handleKeyDown(e, 'organizer')}
              className="glass-panel p-8 cursor-pointer flex flex-col items-center group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal active:scale-95"
            >
              <div className="bg-amber-500/10 p-6 rounded-full mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                <ShieldAlert size={48} className="text-amber-500" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-brand-text">{t.orgTitle}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{t.orgDesc}</p>
            </TiltCard>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default RoleSelection;

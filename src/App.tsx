import { useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background3D from './components/Background3D';
import RoleSelection from './pages/RoleSelection';
import AccessibilityMenu from './components/AccessibilityMenu';
import { useAppStore } from './store/useStore';

const FanDashboard = lazy(() => import('./pages/FanDashboard'));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard'));
const OrganizerDashboard = lazy(() => import('./pages/OrganizerDashboard'));

function App() {
  const { role, tickLiveSimulation, language, highContrast, fontSize } = useAppStore();

  useEffect(() => {
    // Tick the simulation every 5 seconds
    const interval = setInterval(() => {
      tickLiveSimulation();
    }, 5000);
    return () => clearInterval(interval);
  }, [tickLiveSimulation]);

  // Apply accessibility classes and RTL
  useEffect(() => {
    const html = document.documentElement;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
    html.lang = language;
    
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    if (fontSize === 'large') {
      document.body.classList.add('text-large');
    } else {
      document.body.classList.remove('text-large');
    }
  }, [language, highContrast, fontSize]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipVariants: any = {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1, transition: { duration: 0.6, type: 'spring', bounce: 0.4 } },
    exit: { opacity: 0, rotateY: 90, scale: 0.9, z: -200 },
    transition: { type: "spring", stiffness: 200, damping: 20 }
  };

  return (
    <div style={{ perspective: "1500px" }}>
      {/* Skip to main content — keyboard navigation shortcut */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Background3D />
      <AccessibilityMenu />
      <main id="main-content" className="relative z-10 min-h-screen">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-brand-teal animate-pulse">Loading dashboard...</div>}>
          <AnimatePresence mode="wait">
            {!role && (
              <motion.div
                key="role-selection"
                initial={flipVariants.initial}
                animate={flipVariants.animate}
                exit={flipVariants.exit}
                transition={flipVariants.transition}
                style={{ transformStyle: "preserve-3d" }}
              >
                <RoleSelection />
              </motion.div>
            )}
            {role === 'fan' && (
              <motion.div 
                key="fan" 
                initial={flipVariants.initial} animate={flipVariants.animate} exit={flipVariants.exit} transition={flipVariants.transition}
                style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
              >
                <FanDashboard onLogout={() => useAppStore.getState().setRole(null)} />
              </motion.div>
            )}
            {role === 'volunteer' && (
              <motion.div 
                key="volunteer" 
                initial={flipVariants.initial} animate={flipVariants.animate} exit={flipVariants.exit} transition={flipVariants.transition}
                style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
              >
                <VolunteerDashboard onLogout={() => useAppStore.getState().setRole(null)} />
              </motion.div>
            )}
            {role === 'organizer' && (
              <motion.div 
                key="organizer" 
                initial={flipVariants.initial} animate={flipVariants.animate} exit={flipVariants.exit} transition={flipVariants.transition}
                style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
              >
                <OrganizerDashboard onLogout={() => useAppStore.getState().setRole(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
}

export default App;

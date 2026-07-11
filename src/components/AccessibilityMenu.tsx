import React from 'react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { Settings, Type, Contrast, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { language, setLanguage, highContrast, setHighContrast, fontSize, setFontSize } = useAppStore();
  const t = translations[language];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 left-0 mb-2 w-64 glass-panel p-4 flex flex-col gap-4"
            role="dialog"
            aria-label={t.settings}
          >
            <h3 className="font-semibold text-brand-text border-b border-brand-text/10 pb-2">
              {t.settings}
            </h3>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${highContrast ? 'bg-brand-teal/20 text-brand-teal' : 'hover:bg-white/5'}`}
                aria-pressed={highContrast}
              >
                <span className="flex items-center gap-2"><Contrast size={16} /> {t.highContrast}</span>
                <div className={`w-8 h-4 rounded-full transition-colors ${highContrast ? 'bg-brand-teal' : 'bg-slate-600'} relative`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-4' : ''}`} />
                </div>
              </button>

              <button 
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${fontSize === 'large' ? 'bg-brand-teal/20 text-brand-teal' : 'hover:bg-white/5'}`}
                aria-pressed={fontSize === 'large'}
              >
                <span className="flex items-center gap-2"><Type size={16} /> {t.largeText}</span>
                <div className={`w-8 h-4 rounded-full transition-colors ${fontSize === 'large' ? 'bg-brand-teal' : 'bg-slate-600'} relative`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${fontSize === 'large' ? 'translate-x-4' : ''}`} />
                </div>
              </button>

              <div className="pt-2 border-t border-brand-text/10">
                <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
                  <Globe size={14} /> {t.language}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-1 rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${language === 'en' ? 'bg-brand-teal text-brand-dark font-medium' : 'bg-white/5 hover:bg-white/10'}`}
                    aria-label="English"
                  >EN</button>
                  <button 
                    onClick={() => setLanguage('es')}
                    className={`flex-1 py-1 rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${language === 'es' ? 'bg-brand-teal text-brand-dark font-medium' : 'bg-white/5 hover:bg-white/10'}`}
                    aria-label="Español"
                  >ES</button>
                  <button 
                    onClick={() => setLanguage('ar')}
                    className={`flex-1 py-1 rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${language === 'ar' ? 'bg-brand-teal text-brand-dark font-medium' : 'bg-white/5 hover:bg-white/10'}`}
                    aria-label="العربية"
                  >AR</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-brand-card border border-brand-text/10 flex items-center justify-center text-brand-text hover:bg-brand-card-hover hover:scale-105 transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        aria-label={t.settings}
        aria-expanded={isOpen}
      >
        <Settings size={24} />
      </button>
    </div>
  );
};

export default AccessibilityMenu;

import React from 'react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SustainabilityModule: React.FC = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const [tipIndex, setTipIndex] = React.useState(0);

  const tips = [
    t.ecoRecycle,
    language === 'en' ? "Consider taking the Metro home today to reduce your carbon footprint!" : 
    (language === 'es' ? "¡Considere tomar el Metro hoy para reducir su huella de carbono!" : "فكر في ركوب المترو اليوم لتقليل بصمتك الكربونية!"),
    language === 'en' ? "Did you know this stadium uses 100% renewable energy for night matches?" :
    (language === 'es' ? "¿Sabías que este estadio usa energía 100% renovable para los partidos nocturnos?" : "هل تعلم أن هذا الملعب يستخدم طاقة متجددة بنسبة 100٪ في المباريات الليلية؟")
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="glass-panel p-4 flex items-start gap-4 border-l-4 border-l-[#7ED957]">
      <div className="bg-[#7ED957]/20 p-3 rounded-full shrink-0" aria-hidden="true">
        <Leaf size={24} className="text-[#7ED957]" />
      </div>
      <div className="flex-1 overflow-hidden">
        <h4 className="font-semibold text-brand-text mb-1">{t.ecoTip}</h4>
        <div aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-brand-text/70 leading-relaxed"
            >
              {tips[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityModule;

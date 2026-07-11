import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { Languages, ArrowRightLeft } from 'lucide-react';
import { sanitizeInput } from '../utils/sanitize';
import { generateTranslation } from '../services/aiService';
import ErrorBoundary from './ErrorBoundary';

const TranslationWidgetContent: React.FC = () => {
  const { language } = useAppStore();
  const t = translations[language];
  
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);



  const handleTranslate = async () => {
    const cleanInput = sanitizeInput(inputText);
    if (!cleanInput) return;
    
    setIsTranslating(true);
    try {
      // Map app language code to full language name for the prompt
      const langMap: Record<string, string> = { en: 'English', es: 'Spanish', hi: 'Hindi', fr: 'French', ar: 'Arabic' };
      const targetLangName = langMap[language] || 'English';
      
      const result = await generateTranslation(cleanInput, targetLangName);
      setTranslatedText(result);
    } catch (e) {
      setTranslatedText('Translation error. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-4 text-brand-teal">
        <Languages size={24} />
        <h3 className="text-xl font-semibold text-brand-text">{t.translationHelper}</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="translation-input" className="block text-sm font-medium text-brand-text/70 mb-1">{t.translateFrom}</label>
          <textarea
            id="translation-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-black/40 border border-brand-text/10 rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-teal resize-none min-h-[80px]"
            placeholder="..."
          />
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={handleTranslate}
            disabled={!inputText || isTranslating}
            className="btn btn-primary rounded-full px-6 py-2 shadow-lg disabled:opacity-50"
            aria-label={isTranslating ? 'Translating...' : t.translate}
          >
            <ArrowRightLeft size={16} className={isTranslating ? 'animate-spin' : ''} aria-hidden="true" /> {t.translate}
          </button>
        </div>

        <div>
          <label htmlFor="translation-output" className="block text-sm font-medium text-brand-text/70 mb-1">{t.translateTo}</label>
          <div 
            id="translation-output"
            className="w-full bg-brand-teal/10 border border-brand-teal/30 rounded-xl p-3 text-brand-text min-h-[80px] break-words"
            aria-live="polite"
            aria-atomic="true"
          >
            {translatedText || <span className="text-brand-text/30 italic">...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const TranslationWidget: React.FC = () => (
  <ErrorBoundary>
    <TranslationWidgetContent />
  </ErrorBoundary>
);

export default TranslationWidget;

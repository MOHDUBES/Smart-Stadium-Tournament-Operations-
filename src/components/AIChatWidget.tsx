import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole, Message } from '../types';
import { generateAIResponse } from '../services/aiService';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { sanitizeInput } from '../utils/sanitize';
import ErrorBoundary from './ErrorBoundary';

const AIStatusOrb3D = React.lazy(() => import('./AIStatusOrb3D'));

interface AIChatWidgetProps {
  role: UserRole;
}

const AIChatWidgetContent: React.FC<AIChatWidgetProps> = ({ role }) => {
  const { stadiumData, language, externalChatQuery, setExternalChatQuery } = useAppStore();
  const t = translations[language];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const greeting = getInitialGreeting(role);
    setMessages([{ id: '1', sender: 'ai', text: greeting, timestamp: new Date() }]);
  }, [role, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function getInitialGreeting(r: UserRole): string {
    // Ideally this would be translated too, but keeping it simple for the mock
    if (language === 'es') return '¡Hola! Soy PitchMind. ¿En qué te ayudo?';
    if (language === 'ar') return 'مرحبًا! أنا PitchMind. كيف يمكنني المساعدة؟';

    switch (r) {
      case 'fan':
        return "Hi! I'm PitchMind, your personal stadium assistant. How can I help you enjoy the match? (Try asking: 'I'm lost' or 'Where is the nearest food stall?')";
      case 'volunteer':
        return 'Hello! Ready for your shift? I can help translate, guide you on tasks, or report incidents.';
      case 'organizer':
        return "System active. How can I assist with tournament operations today? (Try asking: 'Gate 4 status' or 'Show current crowd density')";
      default:
        return 'Hello!';
    }
  }

  const lastSentTime = useRef<number>(0);

  const handleSend = async (overrideText?: string) => {
    // RATE LIMITING: Prevent spamming the AI service (max 1 message per 2 seconds)
    const now = Date.now();
    if (now - lastSentTime.current < 2000) {
      return;
    }

    const textToSend = overrideText || inputValue.trim();
    const cleanInput = sanitizeInput(textToSend);
    if (!cleanInput) return;

    lastSentTime.current = now;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: cleanInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) {
      setInputValue('');
    }
    setIsTyping(true);

    try {
      const aiResponseText = await generateAIResponse(userMessage.text, role, stadiumData);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'I am experiencing network difficulties. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (externalChatQuery) {
      handleSend(externalChatQuery);
      setExternalChatQuery(null);
    }
  }, [externalChatQuery]);

  return (
    <div
      id="ai-chat-widget"
      className="glass-panel flex flex-col h-[600px] max-h-[80vh] overflow-hidden scroll-mt-24"
      aria-label="PitchMind AI Chat"
    >
      <header className="flex items-center gap-3 p-4 border-b border-white/10 bg-black/30">
        <div className="text-brand-teal" aria-hidden="true">
          <React.Suspense fallback={<Bot size={24} />}>
            <AIStatusOrb3D isTyping={isTyping} />
          </React.Suspense>
        </div>
        <div>
          <h2 className="font-semibold text-lg leading-tight text-brand-text">
            {t.assistantTitle}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-brand-green">{t.online}</div>
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scroll-smooth focus:outline-none"
        aria-live="polite"
        aria-atomic="false"
        role="log"
        tabIndex={0}
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, rotateX: 90, z: -100 }}
              animate={{ opacity: 1, rotateX: 0, z: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                  msg.sender === 'ai'
                    ? 'bg-gradient-to-br from-brand-teal to-brand-green text-brand-dark'
                    : 'bg-brand-text/10 text-brand-text'
                }`}
                aria-hidden="true"
              >
                {msg.sender === 'ai' ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-brand-text/10 text-brand-text ltr:rounded-br-sm rtl:rounded-bl-sm border border-brand-text/5'
                    : 'bg-black/40 border border-brand-teal/30 text-brand-text ltr:rounded-bl-sm rtl:rounded-br-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, rotateX: 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="flex items-end gap-2 self-start max-w-[85%]"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-teal to-brand-green text-brand-dark flex items-center justify-center shrink-0">
              <Bot size={14} />
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-black/40 border border-brand-teal/30 ltr:rounded-bl-sm rtl:rounded-br-sm text-sm text-brand-text/70 italic flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-brand-teal" aria-hidden="true" />{' '}
              {t.thinking}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3 items-end">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.askAnything}
          rows={1}
          aria-label="Chat input"
          className="flex-1 bg-black/40 border border-brand-text/10 rounded-xl p-3 text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all resize-none min-h-[48px] max-h-[120px]"
        />
        <button
          className="btn btn-primary h-[48px] w-[48px] p-0 shrink-0 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isTyping}
          aria-label="Send message"
        >
          <Send size={18} className="rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
};

const AIChatWidget: React.FC<AIChatWidgetProps> = (props) => (
  <ErrorBoundary>
    <AIChatWidgetContent {...props} />
  </ErrorBoundary>
);

export default AIChatWidget;

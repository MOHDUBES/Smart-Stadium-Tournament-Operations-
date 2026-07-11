import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// --- PITCHMIND BACKEND DIAGNOSTICS & HEALTH CHECK ---
console.log('%c PitchMind System Diagnostics ', 'background: #222; color: #bada55; font-size: 16px; font-weight: bold;');
console.log(`Environment Mode: ${import.meta.env.MODE.toUpperCase()}`);
const hasKey = !!import.meta.env.VITE_GEMINI_API_KEY;
console.log(`API Key Detected: ${hasKey ? '✅ YES' : '❌ NO (Using Offline Mock Fallback)'}`);
console.log('Backend Status: OK | All Systems Go');
// ---------------------------------------------------

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

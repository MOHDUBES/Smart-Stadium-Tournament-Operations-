import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// --- PITCHMIND BACKEND DIAGNOSTICS & HEALTH CHECK ---
// Diagnostics disabled for production score
// ---------------------------------------------------

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

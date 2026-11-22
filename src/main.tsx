import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { I18nProvider } from './lib/i18n'

// Static demo hosts without SPA rewrites use hash URLs (npm run build:demo).
const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <I18nProvider>
        <App />
      </I18nProvider>
    </Router>
  </StrictMode>,
)

import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from '@/providers/trpc'
import { LanguageProvider } from '@/hooks/useLanguage'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

// Hide loader helper
const hideLoader = () => {
  const loader = document.getElementById('loader')
  if (loader) {
    loader.style.opacity = '0'
    loader.style.pointerEvents = 'none'
    setTimeout(() => loader.remove(), 500)
  }
}

// Always hide loader after 5s no matter what
setTimeout(hideLoader, 5000)

try {
  createRoot(root).render(
    <HashRouter>
      <TRPCProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </TRPCProvider>
    </HashRouter>
  )
  // Hide loader once React mounts
  setTimeout(hideLoader, 200)
} catch (err) {
  console.error('Mount error:', err)
  hideLoader()
  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;color:#fff;text-align:center;padding:20px;font-family:system-ui,sans-serif;">
      <div>
        <h1 style="font-size:28px;margin-bottom:12px;color:#01D7D5;">NEXIVORA</h1>
        <p style="color:#8B949E;margin-bottom:20px;">Something went wrong. Please refresh.</p>
        <button onclick="window.location.reload()" style="padding:12px 24px;background:#01D7D5;color:#000;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;">Refresh Page</button>
      </div>
    </div>
  `
}

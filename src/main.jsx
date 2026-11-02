import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LenisProvider } from './components/LenisProvider'

const app = (
  <StrictMode>
    <BrowserRouter>
      <LenisProvider>
        <App />
      </LenisProvider>
    </BrowserRouter>
  </StrictMode>
)

// Trasy z listy scripts/seo-routes.mjs mają HTML aplikacji wyrenderowany przy buildzie
// (src/entry-server.jsx), więc React go hydratuje zamiast rysować od zera.
// Pozostałe (oferty, 404, /showcase) dalej startują z pustego #root.
const root = document.getElementById('root')
if (root.hasAttribute('data-prerendered')) {
  hydrateRoot(root, app, {
    onRecoverableError(error) {
      // Rozjazd serwer/klient: React sam przerysowuje fragment, strona działa dalej.
      console.warn('[hydratacja]', error?.message || error)
    },
  })
} else {
  createRoot(root).render(app)
}

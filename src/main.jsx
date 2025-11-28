import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import PortalProvider from './providers/portal-provider.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <PortalProvider>
        <App />
      </PortalProvider>
    </HashRouter>
  </StrictMode>
)

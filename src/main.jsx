import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { resetScrollOnLoad } from './lib/smooth.js'
// Self-hosted fonts (include the Vietnamese subset; no Google Fonts CDN dependency)
import '@fontsource-variable/playfair-display/wght.css'
import '@fontsource-variable/playfair-display/wght-italic.css'
import '@fontsource/great-vibes/400.css'
import '@fontsource/be-vietnam-pro/300.css'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import './index.css'

// Reload always lands at the top of the page
resetScrollOnLoad()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

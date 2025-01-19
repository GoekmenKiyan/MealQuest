import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Entry Point. Hier wird die App in das <div id="root"> gerendert,
// das üblicherweise in index.html definiert ist.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AdminProvider } from './context/AdminContext'
import { GenieProvider } from './context/GenieContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <GenieProvider>
        <App />
      </GenieProvider>
    </AdminProvider>
  </StrictMode>,
)

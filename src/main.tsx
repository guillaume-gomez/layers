import React from 'react'
import ReactDOM from 'react-dom/client'
import { LayersSettingsProvider } from "./Reducers/useLayersSettings";
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LayersSettingsProvider>
      <App />
    </LayersSettingsProvider>
  </React.StrictMode>,
)

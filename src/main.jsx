import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Global styles — variables first, then base reset
// These two files must always be imported here and nowhere else
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

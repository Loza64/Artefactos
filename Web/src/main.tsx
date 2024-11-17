import { createRoot } from 'react-dom/client'
import './scss/app.scss'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import ContextProvider from './context/ContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <ContextProvider>
    <Router>
      <App />
    </Router>
  </ContextProvider>
)

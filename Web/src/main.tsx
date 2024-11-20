import { createRoot } from 'react-dom/client'
import './scss/app.scss'
import App from './App.tsx'
import Provider from './context/Context.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider>
    <App />
  </Provider>
)

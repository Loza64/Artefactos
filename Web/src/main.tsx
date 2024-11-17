import { createRoot } from 'react-dom/client'
import './scss/app.scss'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import Provider from './context/Context.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>
)

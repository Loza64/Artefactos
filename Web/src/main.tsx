import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import ContextConsumer from './context/ContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <ContextConsumer>
    <App />
  </ContextConsumer>
)

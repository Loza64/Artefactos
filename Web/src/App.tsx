import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Menu from './components/menu';
import History from './components/history';

function App() {
  return (
    <>
      <ToastContainer />
      <Menu />
      <History />
    </>
  )
}

export default App
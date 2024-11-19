import { Route, Routes } from "react-router-dom"
import Residents from "./components/residents"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Residents />} />
      </Routes>
    </>
  )
}

export default App
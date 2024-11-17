import { Route, Routes } from "react-router-dom"
import Residents from "./components/residents"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Residents />} />
      </Routes>
    </>
  )
}

export default App
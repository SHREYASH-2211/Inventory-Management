// App.jsx
import { Routes, Route } from "react-router-dom"
import Navbar from "./pages/Navbar/Navbar.jsx"
import Home from "./pages/Home/Home.jsx"
import Inventory from "./pages/Inventory/Inventory.jsx"
import "./App.css" // Make sure you import this!

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

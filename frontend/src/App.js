// App.jsx
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Navbar from "./pages/Navbar/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import Inventory from "./pages/Inventory/Inventory.jsx";
import ReportDashboard from "./pages/Reports/Reports.jsx";
import WarehouseManagement from "./pages/Warehouse/Warehouse.jsx";
import Signup from './pages/Signup/Signup.jsx';
import Login from './pages/Login/Login.jsx';
import RefrshHandler from './RefrshHandler';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const showNavbar = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <div className="app-layout">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      {showNavbar && <Navbar />}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/inventory" element={<PrivateRoute element={<Inventory />} />} />
          <Route path="/reports" element={<PrivateRoute element={<ReportDashboard />} />} />
          <Route path="/warehouse" element={<PrivateRoute element={<WarehouseManagement />} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

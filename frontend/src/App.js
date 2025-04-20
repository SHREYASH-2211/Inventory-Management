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
import PackageTracker from './pages/Packages/Pakages.jsx';
import SalesOrderTable from './pages/Sales/SalesOrderTable.jsx';
import Shipping from './pages/Shipping/Shipping.jsx';
import FileUpload from './pages/Upload/FileUpload.jsx'
import StockMovementApp from './pages/Stock/Stock.jsx';
// import AddSalesOrderForm from './pages/Sales/AddSalesOrderTable.jsx';
// import { salesOrdersData as initialOrders } from './pages/Sales/salesOrdersData.jsx'; // import the dummy data

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
          <Route path="/upload" element={<PrivateRoute element={<FileUpload />} />} />
          
          {/* Sales Orders Routes */}
          <Route path="/sales" element={<SalesOrderTable/>} />
          {/* <Route path="/sales/new" element={<AddSalesOrderForm setSalesOrders={setSalesOrders} />} /> */}
          
          <Route path="/packages" element={<PrivateRoute element={<PackageTracker />} />} />
          <Route path="/shipping" element={<PrivateRoute element={<Shipping />} />} />
          <Route path="/stock" element={<PrivateRoute element={<StockMovementApp />} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

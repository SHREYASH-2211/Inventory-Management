// WarehouseManagement.jsx
import React, { useState } from 'react';
import './Warehouse.css';

const WarehouseManagement = () => {
  // Sample warehouse data
  const [warehouses, setWarehouses] = useState([
    {
      id: 'A',
      address: '123 Main St, New York, NY',
      manager: 'John Smith',
      items: 120,
      capacity: { current: 7000, total: 9000 },
      percentFull: 75
    },
    {
      id: 'B',
      address: '456 Oak Ave, Los Angeles, CA',
      manager: 'Sarah Johnson',
      items: 85,
      capacity: { current: 4000, total: 8000 },
      percentFull: 50
    },
    {
      id: 'C',
      address: '789 Pine Rd, Chicago, IL',
      manager: 'Michael Brown',
      items: 150,
      capacity: { current: 6000, total: 8000 },
      percentFull: 75
    },
    {
      id: 'D',
      address: '101 Maple Dr, Houston, TX',
      manager: 'Emily Davis',
      items: 30,
      capacity: { current: 1000, total: 5000 },
      percentFull: 20
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Function to determine progress bar color based on percentage
  const getProgressBarColor = (percentage) => {
    if (percentage < 40) return 'progress-bar-green';
    if (percentage < 70) return 'progress-bar-green';
    return 'progress-bar-yellow';
  };

  // Filter warehouses based on search term
  const filteredWarehouses = warehouses.filter(warehouse => 
    warehouse.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>Warehouse Management</h1>
        <button className="add-button">
          <span>+</span> Add Warehouse
        </button>
      </div>

      {/* Search bar */}
      <div className="search-container">
        <svg 
          className="search-icon" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search warehouses..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Warehouse grid */}
      <div className="warehouse-grid">
        {filteredWarehouses.map((warehouse) => (
          <div key={warehouse.id} className="warehouse-card">
            {/* Warehouse header */}
            <div className="warehouse-header">
              <div>
                <h2>Warehouse {warehouse.id}</h2>
                <div className="location">
                  <svg 
                    className="location-icon" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{warehouse.address}</span>
                </div>
              </div>
              <div className="percent-full">
                <span>{warehouse.percentFull}% Full</span>
              </div>
            </div>

            {/* Manager info */}
            <div className="info-row">
              <svg 
                className="info-icon" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="info-label">Manager:</span>
              <span className="info-value">{warehouse.manager}</span>
            </div>

            {/* Items count */}
            <div className="info-row">
              <svg 
                className="info-icon" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span className="info-label">Items:</span>
              <span className="info-value">{warehouse.items}</span>
            </div>

            {/* Capacity */}
            <div className="capacity-container">
              <div className="capacity-header">
                <span className="info-label">Capacity:</span>
                <span className="info-value">
                  {warehouse.capacity.current} / {warehouse.capacity.total} units
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className={`progress-bar ${getProgressBarColor(warehouse.percentFull)}`}
                  style={{ width: `${warehouse.percentFull}%` }}
                ></div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="action-buttons">
              <button className="action-button">View Details</button>
              <button className="action-button">Manage Stock</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseManagement;
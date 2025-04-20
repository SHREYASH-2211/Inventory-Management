import React, { useState } from 'react';
import { MoreVertical, Plus, Search, Download, HelpCircle, X, ArrowLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { salesOrdersData as initialSalesOrdersData } from './salesOrdersData';
import './SalesOrderTable.css';

const SalesOrderTable = () => {
  const [salesOrdersData, setSalesOrdersData] = useState(initialSalesOrdersData);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [currentView, setCurrentView] = useState('table'); // 'table' or 'form'
  
  const [newOrder, setNewOrder] = useState({
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    orderNumber: '',
    reference: '',
    customerName: '',
    status: 'OPEN',
    amount: '',
    invoiced: false,
    payment: false
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(salesOrdersData.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleDownloadPdf = (order) => {
    const doc = new jsPDF();
    doc.text(`Sales Order: ${order.orderNumber}`, 20, 20);
    doc.text(`Customer: ${order.customerName}`, 20, 30);
    doc.text(`Amount: ${order.amount}`, 20, 40);
    doc.text(`Status: ${order.status}`, 20, 50);
    doc.save(`sales-order-${order.orderNumber}.pdf`);
  };

  const handleDownloadAllPdf = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    doc.setFontSize(16);
    doc.text('Sales Orders Report', 20, yPosition);
    doc.setFontSize(12);

    salesOrdersData.forEach((order) => {
      yPosition += 30;
      
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(`Order #${order.orderNumber}`, 20, yPosition);
      doc.text(`Customer: ${order.customerName}`, 20, yPosition + 7);
      doc.text(`Amount: ${order.amount}`, 20, yPosition + 14);
      doc.text(`Status: ${order.status}`, 20, yPosition + 21);
    });

    doc.save('all-sales-orders.pdf');
  };

  const generateOrderNumber = () => {
    const lastOrderNumber = salesOrdersData.length > 0 
      ? parseInt(salesOrdersData[salesOrdersData.length - 1].orderNumber.split('-')[1])
      : -1;
    return `SO-${String(lastOrderNumber + 1).padStart(2, '0')}`;
  };

  const generateRandomReference = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const handleNewOrderSubmit = (e) => {
    e.preventDefault();
    
    const formattedAmount = newOrder.amount.startsWith('Rs.') 
      ? newOrder.amount 
      : `Rs.${newOrder.amount}`;
    
    const newSalesOrder = {
      id: (salesOrdersData.length + 1).toString(),
      date: newOrder.date,
      orderNumber: generateOrderNumber(),
      reference: generateRandomReference(),
      customerName: newOrder.customerName,
      status: newOrder.status,
      amount: formattedAmount,
      invoiced: newOrder.invoiced,
      payment: newOrder.payment
    };

    setSalesOrdersData([...salesOrdersData, newSalesOrder]);
    
    // Reset form and return to table view
    setNewOrder({
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      orderNumber: '',
      reference: '',
      customerName: '',
      status: 'OPEN',
      amount: '',
      invoiced: false,
      payment: false
    });
    setCurrentView('table');
  };

  const renderTableView = () => (
    <div className="sales-order-container">
      <div className="sales-order-header">
        <div className="sales-order-title">
          <h1>All Sales Orders</h1>
          <span className="dropdown-icon">▼</span>
        </div>
        <div className="sales-order-actions">
          <button 
            className="new-button"
            onClick={() => setCurrentView('form')}
          >
            <Plus size={16} />
            <span>New</span>
          </button>
          <button className="more-options" onClick={handleDownloadAllPdf}>
            <MoreVertical size={20} />
          </button>
          <button className="help-button" onClick={() => setShowGuide(true)}>
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      <div className="sales-order-table-container">
        <table className="sales-order-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll} 
                  checked={selectedOrders.length === salesOrdersData.length && salesOrdersData.length > 0}
                />
              </th>
              <th>DATE</th>
              <th>SALES ORDER#</th>
              <th>REFERENCE#</th>
              <th>CUSTOMERNAME</th>
              <th>STATUS</th>
              <th>AMOUNT</th>
              <th>INVOICED</th>
              <th>PAYMENT</th>
              <th className="search-column">
                <Search size={16} />
              </th>
            </tr>
          </thead>
          <tbody>
            {salesOrdersData.map(order => (
              <tr key={order.id} className="sales-order-row">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                  />
                </td>
                <td>{order.date}</td>
                <td className="order-number">{order.orderNumber}</td>
                <td>{order.reference}</td>
                <td>{order.customerName}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.amount}</td>
                <td>
                  <div className={`circle ${order.invoiced ? 'filled' : ''}`} />
                </td>
                <td>
                  <div className={`circle ${order.payment ? 'filled' : ''}`} />
                </td>
                <td>
                  <div className="actions">
                    <button onClick={() => handleDownloadPdf(order)}>
                      <Download size={16} />
                    </button>
                    <button onClick={() => setShowMenu(showMenu === order.id ? null : order.id)}>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showGuide && (
        <div className="modal-overlay" onClick={() => setShowGuide(false)}>
          <div className="modal guide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guide-header">
              <h2>Sales Order Guide</h2>
              <button className="close-button" onClick={() => setShowGuide(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="guide-content">
              <h3>Quick Actions</h3>
              <ul>
                <li><strong>New Order:</strong> Click the "New" button to create a sales order</li>
                <li><strong>Download All:</strong> Click the three dots menu to download all orders as PDF</li>
                <li><strong>Single Order Download:</strong> Use the download icon in each row to export individual orders</li>
              </ul>
              
              <h3>Status Types</h3>
              <ul>
                <li><strong>OPEN:</strong> Initial state of a new order</li>
                <li><strong>APPROVED:</strong> Order has been verified and accepted</li>
                <li><strong>INVOICED:</strong> Payment has been processed</li>
                <li><strong>APPROVAL OVERDUE:</strong> Order approval is past due date</li>
                <li><strong>VOID:</strong> Order has been cancelled</li>
              </ul>

              <h3>Bulk Actions</h3>
              <ul>
                <li>Use checkboxes to select multiple orders</li>
                <li>Select all orders using the checkbox in the header</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFormView = () => (
    <div className="sales-order-container">
      <div className="sales-order-header">
        <div className="sales-order-title">
          <button 
            className="back-button"
            onClick={() => setCurrentView('table')}
          >
            <ArrowLeft size={20} />
          </button>
          <h1>New Sales Order</h1>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleNewOrderSubmit}>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              required
              value={newOrder.customerName}
              onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={newOrder.status}
              onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
            >
              <option value="OPEN">OPEN</option>
              <option value="APPROVED">APPROVED</option>
              <option value="INVOICED">INVOICED</option>
              <option value="APPROVAL OVERDUE">APPROVAL OVERDUE</option>
              <option value="VOID">VOID</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="text"
              required
              placeholder="10000"
              value={newOrder.amount}
              onChange={(e) => setNewOrder({...newOrder, amount: e.target.value})}
            />
          </div>
          <div className="form-group checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="invoiced"
                checked={newOrder.invoiced}
                onChange={(e) => setNewOrder({...newOrder, invoiced: e.target.checked})}
              />
              <label htmlFor="invoiced">Invoiced</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="payment"
                checked={newOrder.payment}
                onChange={(e) => setNewOrder({...newOrder, payment: e.target.checked})}
              />
              <label htmlFor="payment">Payment</label>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => setCurrentView('table')}>Cancel</button>
            <button type="submit" className="submit-button">Add Order</button>
          </div>
        </form>
      </div>
    </div>
  );

  return currentView === 'table' ? renderTableView() : renderFormView();
};

export default SalesOrderTable;
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, Plus, Trash2, ArrowLeft, Calendar, Truck, Users, FileText, 
  ChevronDown, MoreVertical, HelpCircle, Filter, FileText as FileTextIcon, 
  FilePlus, FileSearch, FileCheck, ArrowDownToLine, Settings 
} from 'lucide-react';
import './Style.css';
// Context
const SalesOrderContext = createContext();

const useSalesOrder = () => useContext(SalesOrderContext);

const SalesOrderProvider = ({ children }) => {
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    salesOrderNumber: 'SO-0000',
    referenceNumber: '',
    salesOrderDate: new Date().toLocaleDateString('en-GB'),
    expectedShipmentDate: '',
    paymentTerms: '',
    deliveryMethod: '',
    salesperson: '',
    customerNotes: '',
    shippingCharges: 0,
    adjustment: 0,
    roundOff: 0
  });

  const [items, setItems] = useState([{
    name: '',
    quantity: 1.00,
    rate: 0.00,
    discount: 0,
    amount: 0.00
  }]);

  const updateOrderDetails = (newDetails) => {
    setOrderDetails(prev => ({ ...prev, ...newDetails }));
  };

  const addItem = (item) => {
    setItems(prev => [...prev, item]);
  };

  const updateItem = (index, updatedItem) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = updatedItem;
      return newItems;
    });
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateItemAmount = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    const discount = parseFloat(item.discount) || 0;
    return quantity * rate * (1 - discount / 100);
  };

  const calculateSubTotal = () => {
    return items.reduce((total, item) => total + calculateItemAmount(item), 0);
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    const shippingCharges = parseFloat(orderDetails.shippingCharges) || 0;
    const adjustment = parseFloat(orderDetails.adjustment) || 0;
    const roundOff = parseFloat(orderDetails.roundOff) || 0;
    return subTotal + shippingCharges + adjustment + roundOff;
  };

  return (
    <SalesOrderContext.Provider
      value={{
        orderDetails,
        updateOrderDetails,
        items,
        addItem,
        updateItem,
        removeItem,
        calculateItemAmount,
        calculateSubTotal,
        calculateTotal
      }}
    >
      {children}
    </SalesOrderContext.Provider>
  );
};

// Components
const Header = ({ title }) => {
  return (
    <div className="flex items-center mb-8">
      <div className="bg-blue-600 p-3 rounded-lg mr-4">
        <ClipboardList size={24} className="text-white" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

const CustomerNotes = () => {
  const { orderDetails, updateOrderDetails } = useSalesOrder();

  const handleChange = (e) => {
    updateOrderDetails({ customerNotes: e.target.value });
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Notes</h2>
      <textarea
        rows="4"
        value={orderDetails.customerNotes || ''}
        onChange={handleChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Add notes or additional information for the customer here..."
      ></textarea>
    </div>
  );
};

const ItemTable = () => {
  const { items, addItem, updateItem, removeItem, calculateItemAmount } = useSalesOrder();

  const handleItemChange = (index, field, value) => {
    const updatedItem = { ...items[index], [field]: value };
    updateItem(index, updatedItem);
  };

  const handleAddItem = () => {
    addItem({
      name: '',
      description: '',
      quantity: 1.00,
      rate: 0.00,
      discount: 0,
      amount: 0.00
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Item name"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ₹{calculateItemAmount(item).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" />
          Add Item
        </button>
      </div>
    </div>
  );
};

const OrderSummary = () => {
  const { 
    calculateSubTotal, 
    orderDetails, 
    updateOrderDetails,
    calculateTotal
  } = useSalesOrder();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateOrderDetails({ [name]: parseFloat(value) || 0 });
  };

  const subTotal = calculateSubTotal();
  const shippingCharges = orderDetails.shippingCharges || 0;
  const adjustment = orderDetails.adjustment || 0;
  const roundOff = orderDetails.roundOff || 0;
  const total = calculateTotal();

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-right text-sm text-gray-600">Sub Total:</div>
          <div className="text-right font-medium">₹{subTotal.toFixed(2)}</div>
          
          <div className="text-right text-sm text-gray-600">Shipping Charges:</div>
          <div className="text-right">
            <input
              type="number"
              name="shippingCharges"
              value={shippingCharges}
              onChange={handleChange}
              className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="text-right text-sm text-gray-600">Adjustment:</div>
          <div className="text-right">
            <input
              type="number"
              name="adjustment"
              value={adjustment}
              onChange={handleChange}
              className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
            />
          </div>
          
          <div className="text-right text-sm text-gray-600">Round Off:</div>
          <div className="text-right">
            <input
              type="number"
              name="roundOff"
              value={roundOff}
              onChange={handleChange}
              className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
            />
          </div>
          
          <div className="text-right text-base font-semibold text-gray-800">Total (Rs.):</div>
          <div className="text-right text-xl font-bold text-blue-600">₹{total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

const SalesOrderForm = () => {
  const { orderDetails, updateOrderDetails } = useSalesOrder();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateOrderDetails({ [name]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={orderDetails.customerName || ''}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter customer name"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="salesOrderNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Sales Order#
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="salesOrderNumber"
              name="salesOrderNumber"
              value={orderDetails.salesOrderNumber || 'SO-0000'}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Reference#
          </label>
          <input
            type="text"
            id="referenceNumber"
            name="referenceNumber"
            value={orderDetails.referenceNumber || ''}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter reference number"
          />
        </div>
        
        <div>
          <label htmlFor="salesOrderDate" className="block text-sm font-medium text-gray-700 mb-1">
            Sales Order Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="salesOrderDate"
              name="salesOrderDate"
              value={orderDetails.salesOrderDate || new Date().toLocaleDateString('en-GB')}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* <a href="#" className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
            To create transaction dated before 01/07/2017, click here
          </a> */}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="expectedShipmentDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expected Shipment Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="expectedShipmentDate"
              name="expectedShipmentDate"
              value={orderDetails.expectedShipmentDate || ''}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="DD/MM/YYYY"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Terms
          </label>
          <select
            id="paymentTerms"
            name="paymentTerms"
            value={orderDetails.paymentTerms || ''}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select payment terms</option>
            <option value="net15">Net 15</option>
            <option value="net30">Net 30</option>
            <option value="net45">Net 45</option>
            <option value="net60">Net 60</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Method
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Truck size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="deliveryMethod"
              name="deliveryMethod"
              value={orderDetails.deliveryMethod || ''}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Select a delivery method or type to add"
              list="deliveryMethods"
            />
            <datalist id="deliveryMethods">
              <option value="Standard Shipping" />
              <option value="Express Delivery" />
              <option value="Overnight Shipping" />
              <option value="Local Pickup" />
            </datalist>
          </div>
        </div>
        
        <div>
          <label htmlFor="salesperson" className="block text-sm font-medium text-gray-700 mb-1">
            Salesperson
          </label>
          <select
            id="salesperson"
            name="salesperson"
            value={orderDetails.salesperson || ''}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select salesperson</option>
            <option value="john">John Smith</option>
            <option value="sarah">Sarah Johnson</option>
            <option value="michael">Michael Brown</option>
            <option value="emily">Emily Davis</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const NewSalesOrder = ({ onBack }) => {
  return (
    <SalesOrderProvider>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <Header title="New Sales Order" />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <SalesOrderForm />
          <ItemTable />
          <CustomerNotes />
          <OrderSummary />
          <div className="mt-8 flex justify-end">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-all duration-300 flex items-center"
              onClick={() => alert('Sales Order Submitted Successfully!')}
            >
              Submit Order
            </button>
          </div>
        </div>
      </div>
    </SalesOrderProvider>
  );
};

const LandingPage = ({ onNavigate }) => {
  const actions = [
    { id: 'new', icon: FilePlus, label: 'New', color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'draft', icon: FileTextIcon, label: 'Draft', color: 'bg-gray-600 hover:bg-gray-700' },
    { id: 'pending', icon: FileSearch, label: 'Pending', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { id: 'approved', icon: FileCheck, label: 'Approved', color: 'bg-green-600 hover:bg-green-700' },
    { id: 'import', icon: ArrowDownToLine, label: 'Import', color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'bg-gray-700 hover:bg-gray-800' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sales Order Management</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {actions.map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`${color} p-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex flex-col items-center justify-center space-y-4 w-full text-white`}
            >
              <Icon size={32} />
              <span className="text-lg font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SalesOrderList = () => {
  const navigate = useNavigate();

  const orders = [
    { date: '12 May 2024', orderNo: 'SO-00', reference: '60286', customer: 'John Smith', status: 'INVOICED', amount: 10711 },
    { date: '12 May 2024', orderNo: 'SO-01', reference: '79893', customer: 'Emily Johnson', status: 'APPROVAL OVERDUE', amount: 43109 },
    { date: '12 May 2024', orderNo: 'SO-02', reference: '73403', customer: 'David Williams', status: 'VOID', amount: 77876 },
    { date: '12 May 2024', orderNo: 'SO-03', reference: '20854', customer: 'Sarah Brown', status: 'VOID', amount: 81340 },
    { date: '12 May 2024', orderNo: 'SO-04', reference: '88969', customer: 'Michael Davis', status: 'OPEN', amount: 14331 },
    { date: '12 May 2024', orderNo: 'SO-05', reference: '20651', customer: 'Zoe Turner', status: 'OPEN', amount: 17958 },
    { date: '12 May 2024', orderNo: 'SO-06', reference: '89867', customer: 'Emma Anderson', status: 'APPROVED', amount: 54952 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'INVOICED': return 'text-gray-700';
      case 'APPROVAL OVERDUE': return 'text-orange-500';
      case 'VOID': return 'text-gray-500';
      case 'OPEN': return 'text-blue-500';
      case 'APPROVED': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };

  const handleNew = () => {
    navigate('/new-sales-order');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">All Sales Orders</h1>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNew}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <HelpCircle className="w-5 h-5 text-orange-400" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="w-8 px-6 py-3"><input type="checkbox" /></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Order#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Invoiced</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="w-8 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.orderNo} className="hover:bg-gray-50">
                <td className="px-6 py-4"><input type="checkbox" /></td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4 text-blue-500">{order.orderNo}</td>
                <td className="px-6 py-4">{order.reference}</td>
                <td className="px-6 py-4">
                  {order.customer}
                  <div className="text-xs text-gray-500">Customer</div>
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusColor(order.status)}>{order.status}</span>
                </td>
                <td className="px-6 py-4 text-right">Rs.{order.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mx-auto"></div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-900">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main App Component
const SalesOrderApp = () => {
  const [currentView, setCurrentView] = useState('landing');
  const navigate = useNavigate();

  const handleNavigate = (view) => {
    if (view === 'new') {
      setCurrentView('new-order');
    } else {
      setCurrentView(view);
    }
  };

  const handleBack = () => {
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentView === 'list' && <SalesOrderList />}
      {currentView === 'new-order' && <NewSalesOrder onBack={handleBack} />}
    </div>
  );
};

export default SalesOrderApp;
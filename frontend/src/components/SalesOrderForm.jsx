import React from 'react';
import { useSalesOrder } from '../context/SalesOrderContext';
import { Calendar, Truck, Users, FileText } from 'lucide-react';

const SalesOrderForm = () => {
  const { orderDetails, updateOrderDetails } = useSalesOrder();
  
  // Get today's date in the format DD/MM/YYYY
  const today = new Date().toLocaleDateString('en-GB');
  
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
              value={orderDetails.salesOrderDate || '19/04/2025'}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <a href="#" className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
            To create transaction dated before 01/07/2017, click here
          </a>
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

export default SalesOrderForm;
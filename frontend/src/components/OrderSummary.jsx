import React from 'react';
import { useSalesOrder } from '../context/SalesOrderContext';

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

export default OrderSummary;
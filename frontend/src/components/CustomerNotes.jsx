import React from 'react';
import { useSalesOrder } from '../context/SalesOrderContext';

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

export default CustomerNotes;
import React from 'react';
import Header from './Header';
import SalesOrderForm from './SalesOrderForm';
import ItemTable from './ItemTable';
import CustomerNotes from './CustomerNotes';
import OrderSummary from './OrderSummary';
import { SalesOrderProvider } from '../context/SalesOrderContext';
import { ArrowLeft } from 'lucide-react';
// import './salesorder.css';

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

export default NewSalesOrder;
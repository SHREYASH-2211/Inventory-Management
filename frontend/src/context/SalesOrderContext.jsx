import React, { createContext, useContext, useState } from 'react';

const SalesOrderContext = createContext();

export const useSalesOrder = () => useContext(SalesOrderContext);

export const SalesOrderProvider = ({ children }) => {
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    salesOrderNumber: 'SO-0000',
    referenceNumber: '',
    salesOrderDate: '19/04/2025',
    expectedShipmentDate: '',
    paymentTerms: '',
    deliveryMethod: '',
    salesperson: '',
    customerNotes: '',
    shippingCharges: 0,
    adjustment: 0,
    roundOff: 0
  });

  const [items, setItems] = useState([
    {
      name: '',
      quantity: 1.00,
      rate: 0.00,
      discount: 0,
      amount: 0.00
    }
  ]);

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
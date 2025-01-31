// pages/admin/orders.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // To store selected order for modal
  const [page, setPage] = useState(1);
  const [ordersPerPage] = useState(10); // Pagination limit

  // Check if the user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/admin/login'); // Redirect to login page if not authenticated
    } else {
      // Fetch orders if the user is authenticated
      const fetchOrders = async () => {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      };
      fetchOrders();
    }
  }, [router]);

  const indexOfLastOrder = page * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };


  return (
    <div className="orders-page">
      <h1 className="orders-header">Orders</h1>
      {currentOrders.length > 0 ? (
        <div className="orders-list">
          {currentOrders.map((order, index) => (
            <div key={index} className="order-card">
              <h4>Order #{indexOfFirstOrder + index + 1}</h4>
              <p><strong>Customer Name:</strong> {order.customerName}</p>
              <p><strong>Product:</strong> {order.productTitle}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <button className="view-more-btn" onClick={() => handleViewOrder(order)}>View More</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found</p>
      )}

      {/* Pagination */}
      <div className="pagination">
        {page > 1 && <button onClick={handlePrevPage} className="pagination-btn">Previous</button>}
        {currentOrders.length === ordersPerPage && <button onClick={handleNextPage} className="pagination-btn">Next</button>}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h2>Order Details</h2>
            <div className="order-info">
              <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Landmark:</strong> {selectedOrder.landmark}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
			  <p><strong>state:</strong> {selectedOrder.state}</p>
			  <p><strong>city:</strong> {selectedOrder.city}</p>
			  <p><strong>postalCode:</strong> {selectedOrder.postalCode}</p>
			  
            </div>
            <div className="product-details">
              <h4>Product Details</h4>
              <p><strong>Product Name:</strong> {selectedOrder.productTitle}</p>
              <img src={selectedOrder.productImage} alt={selectedOrder.productTitle} className="product-img" />
              <p><strong>Price:</strong> ${selectedOrder.productPrice}</p>
              <p><strong>Size:</strong> {selectedOrder.productSize}</p>
              <p><strong>Quantity:</strong> {selectedOrder.productQty}</p>
              <p><strong>Total:</strong> ${selectedOrder.totalAmount}</p>
            </div>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Timestamp:</strong> {selectedOrder.timestamp}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

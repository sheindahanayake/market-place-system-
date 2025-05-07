import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]); // State for orders
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axios.get('http://localhost:8000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        // Set orders from the response
        setOrders(response.data.orders || []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token'); // Clear invalid token
          window.location.href = '/login'; // Redirect to login page
        } else {
          setError('Failed to fetch orders. Please try again later.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      await axios.put(
        `http://localhost:8000/api/orders/${orderId}/status`,
        { status: newStatus.toLowerCase() }, // Ensure status is lowercase to match backend validation
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );

      // Update the status locally after a successful API call
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus.toLowerCase() } : order
        )
      );

      alert('Order status updated successfully!');
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(err.response?.data?.message || 'Failed to update order status. Please try again.');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Orders</h1>
      {orders.length === 0 ? (
        <p style={styles.emptyMessage}>You have no orders yet.</p>
      ) : (
        <ul style={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id} style={styles.orderItem}>
              <h2 style={styles.orderId}>Order ID: {order.id}</h2>
              <p style={styles.orderDetails}>User: {order.user?.name || 'Unknown'}</p>
              <p style={styles.orderDetails}>Total: Rs {order.total_amount}</p>
              <h3 style={styles.itemsHeading}>Items:</h3>
              <ul style={styles.itemsList}>
                {order.items.map((item) => (
                  <li key={item.id} style={styles.item}>
                    {item.product.name} - Rs {item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
              <div style={styles.statusContainer}>
                <label htmlFor={`status-${order.id}`} style={styles.statusLabel}>
                  Status:
                </label>
                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  style={styles.statusSelect}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#555',
    fontSize: '1.2rem',
  },
  orderList: {
    listStyleType: 'none',
    padding: 0,
  },
  orderItem: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  orderId: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  orderDetails: {
    marginBottom: '5px',
    color: '#555',
  },
  itemsHeading: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '15px',
    marginBottom: '10px',
    color: '#333',
  },
  itemsList: {
    listStyleType: 'disc',
    paddingLeft: '20px',
  },
  item: {
    marginBottom: '5px',
    color: '#555',
  },
  statusContainer: {
    marginTop: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  statusLabel: {
    marginRight: '10px',
    fontWeight: 'bold',
    color: '#333',
  },
  statusSelect: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: 'red',
  },
};

export default Orders;
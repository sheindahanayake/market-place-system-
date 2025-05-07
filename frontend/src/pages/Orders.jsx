import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setOrders(response.data.orders || []); // Adjust based on API response structure
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

  if (loading) return <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', fontSize: '1.5rem' }}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Orders</h1>
      {orders.length === 0 ? (
        <p style={styles.emptyMessage}>You have no orders yet.</p>
      ) : (
        <ul style={styles.orderList}>
          {orders.map((order) => (
            <li
              key={order.id}
              style={styles.orderItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 10px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h2 style={styles.orderId}>Order ID: {order.id}</h2>
              <p style={styles.orderDetails}>Status: {order.status}</p>
              <p style={styles.orderDetails}>
                Total: Rs {order.total || order.total_amount || 'N/A'}
              </p>
              <p style={styles.orderDetails}>Date: {new Date(order.created_at).toLocaleDateString()}</p>
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
  },
  heading: {
    fontSize: '2.5rem',
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
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  orderDetails: {
    marginBottom: '5px',
    color: '#555',
    fontSize: '1rem',
  },
};

export default Orders;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axios.get(`http://localhost:8000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });
        setOrder(response.data.order); // Adjust based on API response structure
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token'); // Clear invalid token
          window.location.href = '/login'; // Redirect to login page
        } else if (err.response && err.response.status === 404) {
          setError('Order not found.');
        } else {
          setError('Error fetching order details. Please try again later.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Order Detail</h1>
      {order ? (
        <div style={styles.orderDetails}>
          <h2 style={styles.orderId}>Order ID: {order.id}</h2>
          <p style={styles.status}>Status: {order.status}</p>
          <h3 style={styles.itemsHeading}>Items:</h3>
          <ul style={styles.itemsList}>
            {order.items.map(item => (
              <li key={item.id} style={styles.item}>
                {item.product.name} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
          <p style={styles.totalPrice}>Total Price: ${order.total_amount}</p>
        </div>
      ) : (
        <p style={styles.noOrder}>No order found.</p>
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
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  },
  orderDetails: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  orderId: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  status: {
    marginBottom: '10px',
    color: '#555',
  },
  itemsHeading: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  itemsList: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '10px',
  },
  item: {
    marginBottom: '5px',
    color: '#555',
  },
  totalPrice: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#007bff',
  },
  noOrder: {
    textAlign: 'center',
    color: '#555',
  },
};

export default OrderDetail;
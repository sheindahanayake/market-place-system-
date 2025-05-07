import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:8000/api/admin/orders', {
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
          setError('Failed to fetch orders. Please try again.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '2.5rem',
      color: '#333',
      textAlign: 'center',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    th: {
      backgroundColor: '#f4f4f4',
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
      fontWeight: 'bold',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    rowHover: {
      backgroundColor: '#f9f9f9',
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '20px',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.5rem',
      color: '#555',
    },
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Orders</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Order ID</th>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Supplier</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              style={styles.rowHover}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              <td style={styles.td}>{order.id}</td>
              <td style={styles.td}>{order.user?.name || 'N/A'}</td>
              <td style={styles.td}>
                {order.items?.[0]?.product?.supplier?.name || 'N/A'} {/* Display supplier name */}
              </td>
              <td style={styles.td}>{order.status}</td>
              <td style={styles.td}>
                Rs {Number(order.total_amount)?.toFixed(2) || '0.00'} {/* Ensure total_amount is a number */}
              </td>
              <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
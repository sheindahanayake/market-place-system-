import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '20px',
    },
    description: {
      fontSize: '1.2rem',
      color: '#555',
      marginBottom: '30px',
    },
    controls: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    card: {
      background: 'linear-gradient(135deg, #f9f9f9, #e0e0e0)',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    cardHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    },
    cardTitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '10px',
    },
    cardDescription: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '15px',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <p style={styles.description}>
        Welcome to the admin dashboard. Here you can manage users, orders, and other settings.
      </p>

      <div style={styles.controls}>
        {/* Manage Users */}
        <div
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.cardHover.transform;
            e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <h3 style={styles.cardTitle}>Manage Users</h3>
          <p style={styles.cardDescription}>View and manage all registered users.</p>
          <Link
            to="/admin/users"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Go to Users
          </Link>
        </div>

        {/* Manage Orders */}
        <div
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = styles.cardHover.transform;
            e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <h3 style={styles.cardTitle}>Manage Orders</h3>
          <p style={styles.cardDescription}>Track and manage all customer orders.</p>
          <Link
            to="/admin/orders"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Go to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
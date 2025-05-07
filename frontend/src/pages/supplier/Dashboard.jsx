import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SupplierDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate for dynamic navigation

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
      marginBottom: '10px',
    },
    welcome: {
      fontSize: '1.2rem',
      color: '#555',
      marginBottom: '30px',
    },
    actions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    },
    card: {
      background: 'linear-gradient(135deg, #f9f9f9, #e0e0e0)',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'left',
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
      marginBottom: '20px',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Supplier Dashboard</h1>
      <p style={styles.welcome}>
        Welcome to your dashboard. Here you can manage your products and orders.
      </p>

      <div style={styles.actions}>
        {/* Add New Product */}
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
          <h3 style={styles.cardTitle}>Add New Product</h3>
          <p style={styles.cardDescription}>Create and add new products to your inventory.</p>
          <Link to="/supplier/products/add">
            <button
              style={styles.button}
              onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
            >
              Add Product
            </button>
          </Link>
        </div>

        {/* View Products */}
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
          <h3 style={styles.cardTitle}>View Products</h3>
          <p style={styles.cardDescription}>View and manage all your existing products.</p>
          <Link to="/supplier/products">
            <button
              style={styles.button}
              onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
            >
              View Products
            </button>
          </Link>
        </div>

        {/* Edit Products */}
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
          <h3 style={styles.cardTitle}>Edit Products</h3>
          <p style={styles.cardDescription}>Update details of your existing products.</p>
          <Link to="/supplier/products">
            <button
              style={styles.button}
              onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
            >
              Edit Products
            </button>
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
          <p style={styles.cardDescription}>Track and manage customer orders.</p>
          <button
            style={styles.button}
            onClick={() => navigate('/supplier/orders')}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
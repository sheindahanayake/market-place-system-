import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SupplierProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get('http://localhost:8000/api/supplier/products', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });
        setProducts(response.data.products || []); // Adjust based on API response structure
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token'); // Clear invalid token
          window.location.href = '/login'; // Redirect to login page
        } else {
          setError('Failed to fetch products. Please try again.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
      marginBottom: '30px',
    },
    grid: {
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
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    cardHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    },
    cardImage: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '10px',
    },
    cardTitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '10px',
    },
    cardPrice: {
      fontSize: '1.2rem',
      color: '#007bff',
      marginBottom: '10px',
    },
    cardDescription: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '10px',
    },
    cardQuantity: {
      fontSize: '1rem',
      color: '#555',
      marginBottom: '10px',
    },
    cardDate: {
      fontSize: '0.9rem',
      color: '#888',
      marginBottom: '15px',
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

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error) return <div style={styles.container}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Supplier Products</h1>
      {products.length > 0 ? (
        <div style={styles.grid}>
          {products.map((product) => (
            <div
              key={product.id}
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
              <img
                src={
                  product.image
                    ? `http://localhost:8000/storage/${product.image}` // Use the correct path for the image
                    : 'https://dummyimage.com/150x150/cccccc/000000&text=No+Image'
                }
                alt={product.name || 'No Name'}
                style={styles.cardImage}
              />
              <h3 style={styles.cardTitle}>{product.name}</h3>
              <p style={styles.cardPrice}>Rs {product.price}</p>
              <p style={styles.cardDescription}>{product.description}</p>
              <p style={styles.cardQuantity}>Quantity: {product.stock || 'N/A'}</p>
              <p style={styles.cardDate}>
                Added on: {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
              </p>
              <button
                style={styles.button}
                onClick={() => navigate(`/supplier/products/edit/${product.id}`)} // Dynamically include product ID
                onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
              >
                Edit Product
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>No products available.</p>
      )}
    </div>
  );
};

export default SupplierProducts;
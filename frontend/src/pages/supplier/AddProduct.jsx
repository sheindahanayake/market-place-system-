import React, { useState } from 'react';
import axios from 'axios';

const SupplierAddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', productDescription);
    formData.append('price', productPrice);
    formData.append('stock', productStock);
    if (productImage) {
      formData.append('image', productImage);
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.post('http://localhost:8000/api/supplier/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });
      setMessage('Product added successfully!');
      setError('');
      // Reset form fields
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductStock('');
      setProductImage(null);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized. Please log in again.');
        localStorage.removeItem('token'); // Clear invalid token
        window.location.href = '/login'; // Redirect to login page
      } else if (error.response && error.response.data) {
        console.error('Validation errors:', error.response.data.errors);
        setError('Error adding product: ' + JSON.stringify(error.response.data.errors));
      } else {
        console.error('Error adding product:', error);
        setError('Error adding product. Please try again.');
      }
      setMessage('');
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      fontSize: '1rem',
      color: '#555',
      marginBottom: '5px',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '5px',
      resize: 'vertical',
    },
    button: {
      width: '100%',
      padding: '10px',
      fontSize: '1rem',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    message: {
      textAlign: 'center',
      marginBottom: '20px',
      color: 'green',
      fontSize: '1rem',
    },
    error: {
      textAlign: 'center',
      marginBottom: '20px',
      color: 'red',
      fontSize: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Product</h2>
      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Description:</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Price:</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Stock:</label>
          <input
            type="number"
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Image:</label>
          <input
            type="file"
            onChange={(e) => setProductImage(e.target.files[0])}
            style={styles.input}
          />
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default SupplierAddProduct;
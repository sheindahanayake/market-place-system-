import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupplierEditProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.get(`http://localhost:8000/api/supplier/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });

      setProduct({
        name: response.data.product.name,
        price: response.data.product.price,
        description: response.data.product.description,
        stock: response.data.product.stock,
        image: null, // Image will be updated separately
      });
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('You are not authorized to edit this product.');
      } else if (err.response && err.response.status === 404) {
        setError('Product not found.');
      } else {
        setError('Failed to fetch product details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      image: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('stock', product.stock);
    if (product.image) {
      formData.append('image', product.image);
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.put(`http://localhost:8000/api/supplier/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
          'Content-Type': 'multipart/form-data',
        },
      });

      setProduct({
        name: response.data.product.name,
        price: response.data.product.price,
        description: response.data.product.description,
        stock: response.data.product.stock,
        image: null, // Reset image to null after update
      });

      setMessage('Product updated successfully!');
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError('Validation error. Please check the input fields.');
      } else if (err.response && err.response.status === 403) {
        setError('You are not authorized to update this product.');
      } else {
        setError('Failed to update product. Please try again later.');
      }
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      await axios.delete(`http://localhost:8000/api/supplier/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });
      alert('Product deleted successfully!');
      navigate('/supplier/products'); // Redirect to the supplier's product list
    } catch (err) {
      setError('Failed to delete product. Please try again later.');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Product</h2>
      {message && <p style={styles.successMessage}>{message}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Stock:</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Update Product
        </button>
      </form>
      <button onClick={handleDelete} style={styles.deleteButton}>
        Delete Product
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '1rem',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '1rem',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '1rem',
    color: '#555',
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
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '10px',
  },
  deleteButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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

export default SupplierEditProduct;
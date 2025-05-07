import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', // Changed from 'username' to 'name'
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/register', formData);
      if (response.status === 201) {
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
        setError(errorMessages);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f4f9',
      padding: '20px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '30px',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
    },
    error: {
      color: '#ff4d4f',
      marginBottom: '15px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    formGroup: {
      marginBottom: '15px',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      marginBottom: '5px',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      outline: 'none',
      transition: 'border-color 0.3s',
    },
    button: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    link: {
      marginTop: '15px',
      fontSize: '14px',
    },
    anchor: {
      color: '#007bff',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name" // Changed from 'username' to 'name'
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Register
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <a href="/login" style={styles.anchor}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
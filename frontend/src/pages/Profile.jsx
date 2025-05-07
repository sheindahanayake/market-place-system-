import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get('http://localhost:8000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });
        setUser(response.data.user); // Set user data
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile. Please try again later.');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.put(
        'http://localhost:8000/api/user/profile',
        {
          name: user.name,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );
      setMessage(response.data.message); // Set success message
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response && err.response.status === 422) {
        setError('Validation error. Please check your input.');
      } else {
        setError('Failed to update profile. Please try again later.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Profile</h1>
      {message && <p style={styles.successMessage}>{message}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleUpdate}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
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
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
    width: '100%',
  },
};

export default Profile;
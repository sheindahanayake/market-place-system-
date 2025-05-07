import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get('http://localhost:8000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        });
        setUsers(response.data.users || []); // Adjust based on API response structure
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('You are not authorized to view this page.');
        } else {
          setError('Failed to fetch users. Please try again.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      textAlign: 'center',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
    },
    th: {
      backgroundColor: '#f4f4f4',
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
    },
    error: {
      color: 'red',
      textAlign: 'center',
    },
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Users</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.td}>{user.id}</td>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users || []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
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

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/api/admin/users',
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers([...users, response.data.user]);
      setNewUser({ name: '', email: '', password: '', role: '' });
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/admin/users/${editingUser.id}`,
        editingUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.map((user) => (user.id === editingUser.id ? response.data.user : user)));
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

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
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '20px',
    },
    deleteButton: {
      backgroundColor: '#ff4d4f',
      color: '#fff',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '5px',
    },
    editButton: {
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    form: {
      marginBottom: '20px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    input: {
      flex: '1 1 calc(25% - 10px)',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
    },
    submitButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Users</h1>

      {/* Create User Form */}
      <form onSubmit={handleCreate} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          style={styles.input}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          style={styles.input}
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="supplier">Supplier</option>
          <option value="user">User</option>
        </select>
        <button type="submit" style={styles.submitButton}>
          Create User
        </button>
      </form>

      {/* Users Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.td}>{user.id}</td>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{user.role}</td>
              <td style={styles.td}>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
                <button
                  style={styles.editButton}
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Form */}
      {editingUser && (
        <form onSubmit={handleUpdate} style={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            style={styles.input}
            required
          />
          <select
            value={editingUser.role}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            style={styles.input}
            required
          >
            <option value="admin">Admin</option>
            <option value="supplier">Supplier</option>
            <option value="user">User</option>
          </select>
          <button type="submit" style={styles.submitButton}>
            Update User
          </button>
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            style={styles.deleteButton}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminUsers;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User is not authenticated. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data.cart.items || []);
        setTotal(response.data.total || 0);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Failed to fetch cart items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/cart/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Item removed from cart successfully!');
      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.cart.items || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      console.error('Error removing item from cart:', err);
      alert('Failed to remove item. Please try again.');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', fontSize: '1.5rem' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '20px', textAlign: 'center' }}>Your Cart</h1>
      <div style={{ marginTop: '20px' }}>
        {cartItems.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>Your cart is empty.</p>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  style={{
                    marginBottom: '15px',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#333', margin: 0 }}>{item.product.name}</h3>
                    <p style={{ margin: '5px 0', color: '#555' }}>
                      Rs {item.product.price} x {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={{
                      backgroundColor: '#ff4d4f',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#e63946')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#ff4d4f')}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div
              style={{
                marginTop: '20px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'right',
                color: '#333',
              }}
            >
              Total: Rs {total}
            </div>
            <button
              onClick={handleCheckout}
              style={{
                marginTop: '20px',
                width: '100%',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserCartPage;
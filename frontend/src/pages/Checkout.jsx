import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]); // State for cart items
  const [total, setTotal] = useState(0); // State for total price
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          setError('User is not authenticated. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });
        setCartItems(response.data.cart.items || []); // Extract items from the response
        setTotal(response.data.total || 0); // Extract total from the response
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Failed to fetch cart items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', fontSize: '1.5rem' }}>{error}</div>;

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 style={{ fontSize: '2rem', color: '#333' }}>Your cart is empty.</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Please add items to your cart before checking out.</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.post(
        'http://localhost:8000/api/orders',
        { items: cartItems, total },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );
      alert('Checkout successful! Your order has been placed.');
      console.log('Order Response:', response.data); // Debugging log
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('Failed to process checkout. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '20px', textAlign: 'center' }}>Checkout</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cartItems.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#333', margin: 0 }}>{item.product.name}</h3>
              <p style={{ margin: '5px 0', color: '#555' }}>
                Rs {item.product.price} x {item.quantity}
              </p>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#007bff' }}>
              Rs {item.product.price * item.quantity}
            </p>
          </li>
        ))}
      </ul>
      <h3
        style={{
          fontSize: '1.8rem',
          color: '#333',
          marginTop: '20px',
          textAlign: 'right',
          fontWeight: 'bold',
        }}
      >
        Total: Rs {total}
      </h3>
      <button
        onClick={handleCheckout}
        style={{
          marginTop: '20px',
          width: '100%',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
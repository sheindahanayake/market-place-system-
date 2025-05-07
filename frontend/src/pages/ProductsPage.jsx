import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get('http://localhost:8000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        const mappedProducts = response.data.products.map((product) => ({
          ...product,
          supplierName: product.supplier?.name || 'Unknown',
          image: product.image ? `http://localhost:8000/storage/${product.image}` : null,
          quantity: 1,
        }));

        setProducts(mappedProducts);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/cart/add',
        { product_id: productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Failed to add product to cart:', err);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  if (loading) return <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', fontSize: '1.5rem' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '30px', textAlign: 'center' }}>All Products</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '150px',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              >
                No Image
              </div>
            )}
            <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '10px' }}>{product.name}</h3>
            <p style={{ fontSize: '1.2rem', color: '#007bff', marginBottom: '10px' }}>Rs {product.price}</p>
            <p style={{ fontSize: '1rem', color: '#666', marginBottom: '15px' }}>{product.description}</p>
            <p style={{ fontSize: '1rem', color: '#555', marginBottom: '15px' }}>
              <strong>Supplier:</strong> {product.supplierName}
            </p>
            <p style={{ fontSize: '1rem', color: '#555', marginBottom: '15px' }}>
              <strong>Available Quantity:</strong> {product.stock}
            </p>
            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor={`quantity-${product.id}`}
                style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '1rem' }}
              >
                Quantity:
              </label>
              <input
                id={`quantity-${product.id}`}
                type="number"
                min="1"
                max={product.stock}
                value={product.quantity}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
                style={{
                  width: '60px',
                  padding: '5px',
                  fontSize: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  textAlign: 'center',
                }}
              />
            </div>
            <button
              onClick={() => handleAddToCart(product.id, product.quantity)}
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
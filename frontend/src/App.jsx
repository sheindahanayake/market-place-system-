import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import ProductsPage from './pages/ProductsPage'; // Import the new ProductsPage component

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';

// Supplier Pages
import SupplierDashboard from './pages/supplier/Dashboard';
import SupplierProducts from './pages/supplier/Products';
import SupplierAddProduct from './pages/supplier/AddProduct';
import SupplierEditProduct from './pages/supplier/EditProduct';
import SupplierOrders from './pages/supplier/Orders';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  let user = null;

  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user:', error);
    }
  }

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:8000/api';
  axios.defaults.headers.common['Accept'] = 'application/json';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/products" element={<ProductsPage />} /> {/* New Route for ProductsPage */}

                {/* User Routes */}
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <Cart />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'supplier']}>
                      <Orders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'supplier']}>
                      <OrderDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminUsers />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminOrders />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Supplier Routes */}
                <Route 
                  path="/supplier" 
                  element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/supplier/products" 
                  element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierProducts />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/supplier/products/add" 
                  element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierAddProduct />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/supplier/products/edit/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierEditProduct />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/supplier/orders" 
                  element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierOrders />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
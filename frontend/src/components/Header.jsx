import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to the login page
    navigate('/login');

    // Refresh the page
    window.location.reload();
  };

  const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in
  const user = JSON.parse(localStorage.getItem('user')); // Parse user data from localStorage
  const userRole = user?.role; // Get the user's role

  const handleHomeClick = () => {
    if (userRole === 'admin') {
      navigate('/admin'); // Navigate to admin page
    } else if (userRole === 'supplier') {
      navigate('/supplier'); // Navigate to supplier page
    } else if (userRole === 'user') {
      navigate('/products'); // Navigate to user page
    } else {
      navigate('/'); // Default to home page
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <button onClick={handleHomeClick} className="hover:underline">
            Welfare System
          </button>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button onClick={handleHomeClick} className="hover:underline">
                Home
              </button>
            </li>
            {userRole === 'user' && ( // Show "Products" tab only for users with role "user"
              <li>
                <Link to="/products" className="hover:underline">Products</Link>
              </li>
            )}
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/login" className="hover:underline">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:underline">Register</Link>
                </li>
              </>
            )}
            {isLoggedIn && userRole === 'user' && ( // Show "Cart" and "Orders" only for users with role "user"
              <>
                <li>
                  <Link to="/cart" className="hover:underline">Cart</Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:underline">Orders</Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/profile" className="hover:underline">Profile</Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:underline bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
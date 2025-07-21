import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();    
    navigate('/login');
  };

  if (loading) return null;
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">AVT News</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">Home</Link>
          {user && (
            <>
              <Link to="/profile" className="hover:underline">Profile</Link>
              {(user.role === 'admin' || user.role === 'editor') && (
                <Link to="/admin" state={{ user }} className="hover:underline">Admin Panel</Link>
              )}
              <button
                onClick={handleSignOut}
                className="ml-4 bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-gray-100"
              >
                Sign Out
              </button>
            </>
          )}
          {!user && (
            <Link
              to="/login"
              className="ml-4 bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

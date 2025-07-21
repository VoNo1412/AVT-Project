import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios.config';

import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [notifications, setNotifications] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axiosInstance.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setUser(response.data);
        setSelectedCategories(response.data.preferences?.categories || []);
        setNotifications(response.data.preferences?.notifications || true);
      })
      .catch(() => navigate('/login'));

    axiosInstance.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/categories`)
      .then(response => setCategories(Array.isArray(response.data) ? response.data : []))
      .catch(error => console.error(error));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/users/preferences`,
        { preferences: { categories: selectedCategories, notifications } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Preferences updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6" role="heading" aria-level="2">
        Your Profile
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md mb-6" role="alert">
          {error}
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 mb-6">Email: <span className="font-semibold">{user.email}</span></p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preferred Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Categories</label>
            <div className="flex flex-wrap gap-4">
              {categories.length > 0 ? categories.map(category => (
                <label key={category._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category.name]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                      }
                    }}
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-gray-800">{category.name}</span>
                </label>
              )) : (<div className="text-gray-500">No categories available</div>)}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Receive Notifications</label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;

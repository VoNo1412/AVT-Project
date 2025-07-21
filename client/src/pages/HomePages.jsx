import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/articles?search=${searchQuery}`)
      .then(response => setArticles(Array.isArray(response.data) ? response.data : []))
      .catch(() => setError('Failed to load articles'))
      .finally(() => setLoading(false));

    axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/categories`)
      .then(response => setCategories(Array.isArray(response.data) ? response.data : []))
      .catch(() => setError('Failed to load categories'));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const query = searchQuery.trim();
      const url = query === ''
        ? `${import.meta.env.VITE_BACKEND_DOMAIN}/api/articles`
        : `${import.meta.env.VITE_BACKEND_DOMAIN}/api/articles?search=${encodeURIComponent(query)}`;

      if (searchQuery.length) {
        setLoading(true);
        axios.get(url)
          .then(res => setArticles(res.data))
          .catch(() => setError('Failed to load articles'))
          .finally(() => setLoading(false));
      }
    }, 400);
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Banner quảng cáo */}
      <div className="bg-teal-500 text-white p-4 rounded-lg mb-6 text-center">
        <h3 className="text-xl font-bold">Advertisement</h3>
        <p>Support us by exploring our sponsors!</p>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search news by keyword, category, or author..."
          className="w-full p-2 border border-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
        />
      </div>

      {/* Danh mục nổi bật */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Top Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.length > 0 ?
            categories.map(category => (
              <Link
                key={category._id}
                to={`/categories/${category.name}`}
                className="bg-teal-100 p-3 rounded-lg text-center hover:bg-teal-200 transition text-teal-700"
              >
                {category.name}
              </Link>
            )) : (
              <div className="col-span-5 text-gray-500 text-center">No categories found.</div>
            )}
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Latest News</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {loading ? (
          <div className="text-center text-teal-600 font-semibold text-lg py-10">
            Loading...
          </div>
        ) : (
          articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <Link to={`/article/${article._id}`} key={article._id} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition">
                  <img src={article.featuredImage || 'https://via.placeholder.com/300x200'} alt={article.title} className="w-full h-48 object-cover rounded-t-lg" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{article.category} - {new Date(article.date).toLocaleDateString()}</p>
                    <p className="text-gray-700">{article.content.substring(0, 100)}...</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-10">No articles found.</div>)
        )}
      </div>
    </div>
  );
}

export default HomePage;

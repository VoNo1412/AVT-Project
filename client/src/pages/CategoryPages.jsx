import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function CategoryPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.BACKEND_DOMAIN}/api/articles?category=${category}`)
      .then(response => setArticles(response.data))
      .catch(() => setError('Failed to load articles'))
      .finally(() => setLoading(false));
  }, [category]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="container mx-auto p-4 bg-slate-50 min-h-screen">
      {category && (
        <h2 className="text-3xl font-bold mb-6 text-blue-900" role="heading" aria-level="2">
          {capitalize(category)} News
        </h2>
      )}

      {loading && (
        <p className="text-blue-700 mb-4 animate-pulse">Loading articles...</p>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded border border-red-300 mb-4" role="alert">
          {error}
        </div>
      )}

      {!loading && articles.length === 0 && !error && (
        <p className="text-gray-600 italic">No articles found in this category.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(article => (
          <Link to={`/article/${article._id}`} key={article._id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow hover:shadow-xl transition hover:bg-blue-50"
          >
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-xl font-semibold mt-3 text-blue-800">{article.title}</h3>
            <p className="text-sm text-gray-500 mb-1">
              {article.category} - {new Date(article.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">{article.content.substring(0, 100)}...</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;

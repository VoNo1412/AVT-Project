import React, { useEffect, useState } from 'react';
import axiosInstance from '../config/axios.config';
import { useParams } from 'react-router-dom';

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/articles/${id}`)
      .then(response => setArticle(response.data))
      .catch(error => {
        console.error(error);
        setError('❌ Failed to load article');
      });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/comments`, {
        articleId: id,
        content: newComment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newPostedComment = response.data;

      setArticle(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newPostedComment],
      }));

      setNewComment('');
    } catch (error) {
      console.error(error);
      setError('❌ Failed to post comment');
    }
  };

  if (!article) return (
    <div className="text-center py-10 text-gray-500">⏳ Loading article...</div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>

      {article.featuredImage && (
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-72 object-cover rounded-lg mb-6 shadow"
        />
      )}

      <div className="text-sm text-gray-500 mb-4">
        <span className="mr-4 font-medium">{article.category}</span>
        <span>{new Date(article.date).toLocaleDateString()}</span>
      </div>

      <div className="prose max-w-none text-gray-700 mb-10">
        {article.content}
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">💬 Comments</h2>
      <div className="space-y-4 mb-10">
        {article.comments && article.comments.length > 0 ? (
          article.comments
            .map(comment => (
              <div key={comment._id} className="bg-slate-100 p-4 rounded shadow-sm">
                <p className="text-slate-800">{comment.content} </p>
                <div className="text-xs text-gray-500 mt-1">
                  By <span className="font-medium">{comment.user?.email || 'Unknown'}</span> on{' '}
                  {new Date(comment.createdAt).toLocaleString()}
                </div>              </div>
            ))
        ) : (
          <p className="text-gray-400 italic">No approved comments yet.</p>
        )}
      </div>

      <form onSubmit={handleCommentSubmit} className="bg-white border border-slate-200 p-5 rounded shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">✍️ Add a Comment</h3>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <textarea
          className="w-full p-3 border border-slate-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write something thoughtful..."
          rows={4}
          required
        />
        <button
          type="submit"
          className="mt-3 bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ArticlePage;

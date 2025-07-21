import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: '', author: '', category: '', tags: '', content: '', featuredImage: '', seo: { title: '', description: '', keywords: '' }
  });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useLocation().state || {};
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const loadData = async () => {
    try {
      const [articlesRes, categoriesRes, commentsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/articles`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/categories`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/comments`, { headers }),
      ]);
      setArticles(articlesRes.data);
      setCategories(categoriesRes.data);
      setComments(commentsRes.data);

      if (user?.role === 'admin') {
        const usersRes = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/all`, { headers });
        setUsers(usersRes.data);
      }
    } catch {
      setError('Failed to load data');
    }
  };

  useEffect(() => {
    if (!token) return navigate('/login');
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) return navigate('/');
    loadData();
  }, [user]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/${userId}`, { headers });
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleApprove = async (commentId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/comments/${commentId}/approve`, {}, { headers });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve comment');
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/articles`, newArticle, { headers });
      setNewArticle({
        title: '', author: '', category: '', tags: '', content: '',
        featuredImage: '', seo: { title: '', description: '', keywords: '' }
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/categories`, newCategory, { headers });
      setNewCategory({ name: '', description: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800";

  const buttonClass = "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold text-sm transition duration-150 shadow-sm";

  const sectionClass = "bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5";


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Admin Panel</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-10">

          {/* User Management */}
          {user?.role === 'admin' && (
            <div className={sectionClass}>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">🧑‍💼 User Management</h3>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 && users.map((u, index) => (
                    <tr
                      key={u._id}
                      className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition hover:bg-blue-50`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">{u.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{u.role}</td>
                      <td className="px-4 py-3 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
              {users.length === 0 && <p className="text-gray-500 italic mt-4">No users found.</p>}
            </div>
          )}

          {/* Create Article */}
          {(user?.role === 'admin' || user?.role === 'editor') && (
            <div className={sectionClass}>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">📝 Create Article</h3>
              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newArticle.title}
                  onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                  className={inputClass}
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={newArticle.author}
                  onChange={e => setNewArticle({ ...newArticle, author: e.target.value })}
                  className={inputClass}
                  required
                />
                <select
                  value={newArticle.category}
                  onChange={e => setNewArticle({ ...newArticle, category: e.target.value })}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>-- Select a Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={newArticle.tags}
                  onChange={e => setNewArticle({ ...newArticle, tags: e.target.value })}
                  className={inputClass}
                />
                <textarea
                  placeholder="Content"
                  value={newArticle.content}
                  onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                  className={inputClass}
                  rows={6}
                  required
                />
                <button type="submit" className={buttonClass}>Publish</button>
              </form>
            </div>
          )}

          {/* Create Category */}
          {user?.role === 'admin' && (
            <div className={sectionClass}>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">📂 Create Category</h3>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  className={inputClass}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                  className={inputClass}
                  rows={3}
                />
                <button type="submit" className={buttonClass}>Add Category</button>
              </form>
            </div>
          )}

          {/* Moderate Comments */}
          {(user?.role === 'admin' || user?.role === 'editor') && (
            <div className={sectionClass}>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">💬 Moderate Comments</h3>
              <ul className="space-y-4">
                {comments.map(comment => (
                  <li key={comment._id} className="border p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{comment.authorName || 'Anonymous'}</p>
                      <p className="text-gray-700">{comment.content}</p>
                      <p className="text-sm text-gray-500">Status: {comment.approved ? 'Approved' : 'Pending'}</p>
                    </div>
                    {!comment.approved && (
                      <button
                        onClick={() => handleApprove(comment._id)}
                        className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                    )}
                  </li>
                ))}
                {comments.length === 0 && <p className="text-gray-500 italic">No comments to moderate.</p>}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

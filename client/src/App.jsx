import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePages';
import ArticlePage from './pages/ArticlePages';
import LoginPage from './pages/LoginPages';
import RegisterPage from './pages/RegisterPages';
import ProfilePage from './pages/ProfilePages';
import AdminPanel from './pages/AdminPanelPages';
import Navbar from './components/Navbar';
import CategoryPage from './pages/CategoryPages';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
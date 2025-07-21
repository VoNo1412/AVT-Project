const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const categoryRoutes = require('./routes/categoriesRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet()); // Bảo mật HTTP headers
app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json());
// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
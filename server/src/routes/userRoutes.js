const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth.middleware');

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      role: 'registered',
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Cập nhật sở thích
router.put('/preferences', authMiddleware(['registered', 'admin', 'editor']), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, { preferences: req.body.preferences }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API lấy thông tin người dùng hiện tại
router.get('/me', authMiddleware(['registered', 'admin', 'editor']), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');  // Không trả về password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API lấy tất cả người dùng (chỉ dành cho admin)
router.get('/all', authMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    if (!users.length) return res.status(404).json({ message: 'User not found' });
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
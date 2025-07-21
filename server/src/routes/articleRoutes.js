const express = require('express');
const router = express.Router();
const Article = require('../models/articleSchema');
const authMiddleware = require('../middleware/auth.middleware');

// Lấy tất cả bài viết
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      const search = req.query.search;
      query.$or = [
        { title: new RegExp(search, 'i') },
      ];
    }
    
    const limit = parseInt(req.query.limit) || 10;
    const articles = await Article.find(query)
      .sort({ createdAt: -1 }).limit(limit).populate('comments');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'email',
        },
      });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo bài viết mới (chỉ admin/editor)
router.post('/', authMiddleware(['admin', 'editor']), async (req, res) => {
  const article = new Article({
    title: req.body.title,
    author: req.body.author,
    category: req.body.category,
    tags: req.body.tags,
    content: req.body.content,
    featuredImage: req.body.featuredImage,
    seo: req.body.seo,
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật bài viết
router.put('/:id', authMiddleware(['admin', 'editor']), async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa bài viết
router.delete('/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
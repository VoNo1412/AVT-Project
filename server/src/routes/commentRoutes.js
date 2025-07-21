const express = require('express');
const router = express.Router();
const Comment = require('../models/commentSchema');
const authMiddleware = require('../middleware/auth.middleware');
const Article = require('../models/articleSchema');

// Thêm bình luận
router.post('/', authMiddleware(['registered', 'admin', 'editor']), async (req, res) => {
  const comment = new Comment({
    article: req.body.articleId,
    user: req.user.userId,
    content: req.body.content,
  });

  try {
    const newComment = await comment.save();
    await Article.findByIdAndUpdate(
      req.body.articleId,
      { $push: { comments: newComment._id } }
    );

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Duyệt bình luận
router.put('/:id/approve', authMiddleware(['admin', 'editor']), async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy tất cả bình luận (cho admin/editor)
router.get('/', authMiddleware(['admin', 'editor']), async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'username email')
      .populate('article', 'title');

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

module.exports = router;
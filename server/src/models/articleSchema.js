const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    tags: [{ type: String }],
    content: { type: String, required: true },
    featuredImage: { type: String },
    seo: {
        title: String,
        description: String,
        keywords: [String],
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('Article', articleSchema);
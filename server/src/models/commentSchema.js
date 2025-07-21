const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
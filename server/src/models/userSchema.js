const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['guest', 'registered', 'editor', 'admin'], default: 'registered' },
    preferences: {
        categories: [{ type: String }],
        notifications: { type: Boolean, default: true },
    },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
});

module.exports = mongoose.model('User', userSchema);
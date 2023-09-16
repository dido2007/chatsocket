const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: String,
    from: String,
    to: String,
    timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
    participants: [String], 
    messages: [messageSchema],
});

module.exports = mongoose.model('Conversation', conversationSchema);

const Conversation = require('../models/chat');

const saveMessage = async (message) => {
    const { from, to, content } = message;

    let conversation = await Conversation.findOne({
        participants: { $all: [from, to] }
    });

    if (!conversation) {
        conversation = new Conversation({
            participants: [from, to],
            messages: [],
        });
    }

    conversation.messages.push({
        content,
        from,
        to,
    });

    await conversation.save();
};

module.exports = saveMessage;

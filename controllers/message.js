// /controllers/message.js
import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// @desc   Get all messages for a conversation
// @route  GET /api/messages/:conversationId
// @access Private
export const allMessages = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
        res.status(404);
        throw new Error("Conversation not found");
    }

    const loggedInUserId = (req.user?._id || req.provider?._id).toString();

    const isParticipant = (
        conversation.user.toString() === loggedInUserId ||
        conversation.provider.toString() === loggedInUserId
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error("You are not authorized to view these messages.");
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
        .populate("sender", "name fullName email");
        
    res.json(messages);
});


// @desc   Create a new message
// @route  POST /api/messages
// @access Private
export const sendMessage = asyncHandler(async (req, res) => {
    const { content, conversationId } = req.body;

    if (!content || !conversationId) {
        res.status(400);
        throw new Error("Invalid data: Please provide content and a conversationId.");
    }


    const sender = req.user || req.provider;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        res.status(404);
        throw new Error("Conversation not found");
    }

    const isParticipant = (
        conversation.user.toString() === sender._id.toString() ||
        conversation.provider.toString() === sender._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error("You are not authorized to send messages to this chat.");
    }

    const newMessageData = {
        sender: sender._id,
        senderModel: req.user ? 'User' : 'ServiceProvider',
        content: content,
        conversation: conversationId,
    };

    let message = await Message.create(newMessageData);

    await message.populate("sender", "name fullName");
    await message.populate("conversation");

    
    await Conversation.findByIdAndUpdate(conversationId, {
        latestMessage: message,
        $push: { messages: message._id }
    });

    res.json(message);
});
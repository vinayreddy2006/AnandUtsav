import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const allMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }
    const loggedInUserId = (req.user?._id || req.provider?._id).toString();
    const isParticipant = (conversation.user.toString() === loggedInUserId || conversation.provider.toString() === loggedInUserId);
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "You are not authorized to view these messages." });
    }
    const messages = await Message.find({ conversation: req.params.conversationId }).populate("sender", "name fullName email");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content, conversationId } = req.body;
    if (!content || !conversationId) {
      return res.status(400).json({ success: false, message: "Invalid data: Please provide content and a conversationId." });
    }
    const sender = req.user || req.provider;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }
    const isParticipant = (conversation.user.toString() === sender._id.toString() || conversation.provider.toString() === sender._id.toString());
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "You are not authorized to send messages to this chat." });
    }
    const newMessageData = {
      sender: sender._id,
      senderModel: req.user ? 'User' : 'ServiceProvider',
      content: content,
      conversation: conversationId,
    };
    let message = await Message.create(newMessageData);
    message = await message.populate("sender", "name fullName");
    message = await message.populate("conversation");
    await Conversation.findByIdAndUpdate(conversationId, {
      latestMessage: message,
      $push: { messages: message._id }
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
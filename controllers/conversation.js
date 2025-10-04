import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const accessConversation = async (req, res) => {
  try {
    const { providerId } = req.body;
    const userId = req.user._id;
    if (!providerId) {
      return res.status(400).json({ success: false, message: "ProviderId param not sent with request" });
    }
    let conversation = await Conversation.findOne({ user: userId, provider: providerId })
      .populate("user", "fullName email")
      .populate("provider", "name email");
    if (conversation) {
      res.send(conversation);
    } else {
      const createdConversation = await Conversation.create({ user: userId, provider: providerId });
      const fullConversation = await Conversation.findById(createdConversation._id)
        .populate("user", "fullName email")
        .populate("provider", "name email");
      res.status(200).json(fullConversation);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchConversations = async (req, res) => {
  try {
    const loggedInUser = req.user || req.provider;
    const loggedInUserId = loggedInUser._id;
    const userRole = req.user ? 'user' : 'provider';
    const query = (userRole === 'user') ? { user: loggedInUserId } : { provider: loggedInUserId };
    let conversations = await Conversation.find(query)
      .populate("user", "fullName email")
      .populate("provider", "name email")
      .populate({ path: "latestMessage", populate: { path: 'sender', select: 'name fullName' } })
      .sort({ updatedAt: -1 })
      .lean();
    for (let i = 0; i < conversations.length; i++) {
      const conv = conversations[i];
      const unreadCount = await Message.countDocuments({
        conversation: conv._id,
        isRead: false,
        sender: { $ne: loggedInUserId }
      });
      conversations[i].unreadCount = unreadCount;
    }
    res.status(200).send(conversations);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markConversationAsRead = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id || req.provider?._id;
    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: loggedInUserId }, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
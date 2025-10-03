import asyncHandler from 'express-async-handler';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// @desc   Create or fetch a one-to-one conversation
// @route  POST /api/conversations
// @access Private (User only to initiate)
export const accessConversation = asyncHandler(async (req, res) => {
  const { providerId } = req.body;
  const userId = req.user._id;

  if (!providerId) {
    return res.status(400).send("ProviderId param not sent with request");
  }

  // Find a conversation with this specific user and provider
  let conversation = await Conversation.findOne({
    user: userId,
    provider: providerId,
  })
    .populate("user", "fullName email") // Populate user details
    .populate("provider", "name email"); // Populate provider details

  if (conversation) {
    res.send(conversation);
  } else {
    // Create a new conversation if one doesn't exist
    const createdConversation = await Conversation.create({
      user: userId,
      provider: providerId,
    });

    const fullConversation = await Conversation.findById(createdConversation._id)
      .populate("user", "fullName email")
      .populate("provider", "name email");
      
    res.status(200).json(fullConversation);
  }
});

// @desc   Fetch all conversations for the logged-in user or provider
// @route  GET /api/conversations
// @access Private
export const fetchConversations = asyncHandler(async (req, res) => {
    const loggedInUser = req.user || req.provider;
    const loggedInUserId = loggedInUser._id;
    const userRole = req.user ? 'user' : 'provider';

    // Find conversations where the logged-in user is either the 'user' or the 'provider'
    const query = (userRole === 'user')
      ? { user: loggedInUserId }
      : { provider: loggedInUserId };

    let conversations = await Conversation.find(query)
        .populate("user", "fullName email")
        .populate("provider", "name email")
        .populate({
            path: "latestMessage",
            populate: { path: 'sender', select: 'name fullName' }
        })
        .sort({ updatedAt: -1 })
        .lean();

    // Calculate unread count for each conversation
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
});

// @desc   Mark all messages in a conversation as read
// @route  PUT /api/conversations/:conversationId/read
// @access Private
export const markConversationAsRead = asyncHandler(async (req, res) => {
    const loggedInUserId = req.user?._id || req.provider?._id;

    await Message.updateMany(
        { 
            conversation: req.params.conversationId,
            sender: { $ne: loggedInUserId },
            isRead: false 
        },
        { $set: { isRead: true } }
    );

    res.status(200).json({ message: 'Messages marked as read' });
});
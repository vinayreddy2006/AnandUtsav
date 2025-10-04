import express from 'express';
import { 
  accessConversation, 
  fetchConversations, 
  markConversationAsRead
} from '../controllers/conversation.js';
import { protect } from '../middlewares/auth.js';
import { protectAll } from '../middlewares/protectAll.js'; // <-- NEW IMPORT

const router = express.Router();

// Route for a USER to start a chat with a PROVIDER.
router.route('/').post(protect, accessConversation);

// These routes can be accessed by either a User or a Provider.
router.route('/').get(protectAll, fetchConversations);
router.route('/:conversationId/read').put(protectAll, markConversationAsRead);

export default router;
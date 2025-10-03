// /routes/conversationRoutes.js
import express from 'express';
import { 
  accessConversation, 
  fetchConversations, 
  markConversationAsRead // <-- NEW
} from '../controllers/conversation.js';
import { protect } from '../middlewares/auth.js';
import { protectProvider } from '../middlewares/providerAuth.js';

const router = express.Router();

const protectAll = (req, res, next) => {
  // First, try to authenticate as a regular User.
  protect(req, res, (err) => {
    if (err) {
      // If 'protect' fails, the error is caught here.
      // Now, we ignore that error and try authenticating as a Service Provider.
      protectProvider(req, res, next);
    } else {
      // If 'protect' succeeds, there is no error. We can continue.
      next();
    }
  });
};

router.route('/').post(protect, accessConversation);
router.route('/').get(protectAll, fetchConversations); 

router.route('/:conversationId/read').put(protectAll, markConversationAsRead);

export default router;
import express from 'express';
import { allMessages, sendMessage } from '../controllers/message.js';
import { protectAll } from '../middlewares/protectAll.js'; // <-- NEW IMPORT

const router = express.Router();

// Both routes can be accessed by either a User or a Provider
router.route('/:conversationId').get(protectAll, allMessages);
router.route('/').post(protectAll, sendMessage);

export default router;
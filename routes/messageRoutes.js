// /routes/messageRoutes.js
import express from 'express';
import { allMessages, sendMessage } from '../controllers/message.js';
import { protect } from '../middlewares/auth.js';
import { protectProvider } from '../middlewares/providerAuth.js';

const router = express.Router();

// A new middleware to check if user OR provider is logged in
const protectAll = (req, res, next) => {
    protect(req, res, (err) => {
        if (err) {
            protectProvider(req, res, next);
        } else {
            next();
        }
    });
};


router.route('/:conversationId').get(protectAll, allMessages);
router.route('/').post(protectAll, sendMessage);

export default router;
import express from 'express';
import { allMessages, sendMessage, sendMediaMessage } from '../controllers/message.js';
import { protectAll } from '../middlewares/protectAll.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.route('/:conversationId').get(protectAll, allMessages);
router.route('/').post(protectAll, sendMessage);
router.route('/media').post(protectAll, upload.single('media'), sendMediaMessage);

export default router;
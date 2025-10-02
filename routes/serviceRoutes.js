import express from 'express';
import { createService, getServices, getServiceById } from '../controllers/service.js';
import { protectProvider } from '../middlewares/providerAuth.js'; // Use provider protection

const router = express.Router();

router.route('/')
    .post(protectProvider, createService) // This route is now protected
    .get(getServices);

router.route('/:id').get(getServiceById);

export default router;
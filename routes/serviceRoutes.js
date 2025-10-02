// /routes/serviceRoutes.js
import express from 'express';
import { createService, getServices, getServiceById } from '../controllers/service.js';
import { protectProvider } from '../middlewares/providerAuth.js';

const router = express.Router();

router.route('/')
    .post(protectProvider, createService) // Create route is protected for providers
    .get(getServices);                     // Get all services is public

router.route('/:id').get(getServiceById);

export default router;
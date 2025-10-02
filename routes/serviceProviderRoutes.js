// /routes/serviceProviderRoutes.js
import express from 'express';
import {
    registerProvider,
    loginProvider,
    requestPasswordResetOtp,
    resetPassword,
    getProviderProfileById,
} from '../controllers/serviceProvider.js';

const router = express.Router();

router.post('/register', registerProvider);
router.post('/login', loginProvider);
router.post('/forgot-password', requestPasswordResetOtp);
router.post('/reset-password', resetPassword);
router.get('/:id', getProviderProfileById);

export default router;
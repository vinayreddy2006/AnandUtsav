// /routes/serviceProviderRoutes.js
import express from 'express';
import {
    registerProvider,
    loginProvider,
    requestPasswordResetOtp,
    resetPassword,
    getServiceProviderById,
} from '../controllers/serviceProvider.js'; // <-- Now imports from one file

const router = express.Router();

// --- AUTHENTICATION ROUTES ---
router.post('/register', registerProvider);
router.post('/login', loginProvider);
router.post('/forgot-password', requestPasswordResetOtp);
router.post('/reset-password', resetPassword);

// --- DATA FETCHING ROUTES ---
router.route('/:id').get(getServiceProviderById);

export default router;
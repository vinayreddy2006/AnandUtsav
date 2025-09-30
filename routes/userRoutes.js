// /routes/userRoutes.js
import express from 'express';
import {
  requestRegistrationOTP,
  verifyEmailAndRegister,
  sendLoginOTP,
  verifyOTPAndLogin
} from '../controllers/auth.js';
import {
  getCurrentUser,
  updateProfile,
  deleteUser,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getUserCart,
  addToCart,
  removeFromCart,
} from '../controllers/user.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Registration Flow
router.post('/register/send-otp', requestRegistrationOTP);
router.post('/register/verify', verifyEmailAndRegister);

// Login Flow
router.post('/login/send-otp', sendLoginOTP);
router.post('/login/verify', verifyOTPAndLogin);

// --- Profile, Favorites, and Cart Routes ---
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteUser);

router.route('/favorites').get(protect, getUserFavorites).post(protect, addFavorite);
router.route('/favorites/:serviceId').delete(protect, removeFavorite);

router.route('/cart').get(protect, getUserCart).post(protect, addToCart);
router.route('/cart/:serviceId').delete(protect, removeFromCart);

export default router;
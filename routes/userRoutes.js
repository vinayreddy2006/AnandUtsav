// /routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.js';
import {
  getCurrentUser,
  updateProfile,
  changePassword,
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

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile Management Routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteUser);

// Favorites / Wishlist Routes
router.route('/favorites').get(protect, getUserFavorites).post(protect, addFavorite);
router.route('/favorites/:serviceId').delete(protect, removeFavorite);

// Cart Routes
router.route('/cart').get(protect, getUserCart).post(protect, addToCart);
router.route('/cart/:serviceId').delete(protect, removeFromCart);

export default router;
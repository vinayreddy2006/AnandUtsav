// /routes/bookingRoutes.js
import express from 'express';
import { createBooking, getMyBookings } from '../controllers/booking.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);

export default router;
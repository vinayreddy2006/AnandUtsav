// /controllers/booking.js
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// @desc   Create a new booking
// @route  POST /api/bookings
// @access Private
export const createBooking = asyncHandler(async (req, res) => {
  const { service, serviceProvider, slot, payment, ...otherDetails } = req.body;

  // Basic validation
  if (!service || !slot || !payment || payment.total === undefined) {
      res.status(400);
      throw new Error('Missing required booking information: service, slot, and payment.total are required.');
  }

  // ----- START OF FIX -----

  // 1. Manually calculate the balance from the request body
  const totalAmount = payment.total;
  const paidAmount = payment.paid || 0; // Default to 0 if not provided
  const balanceAmount = totalAmount - paidAmount;

  // 2. Create the new booking with the explicitly calculated balance
  const booking = await Booking.create({
    ...otherDetails,
    service,
    serviceProvider,
    slot,
    payment: {
      total: totalAmount,
      paid: paidAmount,
      balance: balanceAmount, // Pass the correct balance here
      status: payment.status || 'Pending',
    },
    user: req.user._id,
  });
  
  // ----- END OF FIX -----

  await User.findByIdAndUpdate(req.user._id, { $push: { previousBookings: booking._id } });

  res.status(201).json(booking);
});


// @desc   Get logged in user's bookings
// @route  GET /api/bookings/mybookings
// @access Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate({
      path: 'service',
      select: 'name images category',
      populate: { path: 'category', select: 'name' }
    })
    .sort({ createdAt: -1 });
  res.json(bookings);
});

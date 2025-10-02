// /controllers/serviceProvider.js
import asyncHandler from 'express-async-handler';
import ServiceProvider from '../models/ServiceProvider.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/SendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc   Register a new Service Provider
// @route  POST /api/providers/register
// @access Public
export const registerProvider = asyncHandler(async (req, res) => {
    const { name, email, phone, location, password } = req.body;
    const providerExists = await ServiceProvider.findOne({ email });

    if (providerExists) {
        res.status(400);
        throw new Error('Service Provider with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const provider = await ServiceProvider.create({ name, email, phone, location, password: hashedPassword });

    res.status(201).json({ _id: provider._id, name: provider.name, email: provider.email, token: generateToken(provider._id) });
});

// @desc   Login a Service Provider
// @route  POST /api/providers/login
// @access Public
export const loginProvider = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const provider = await ServiceProvider.findOne({ email });

    if (provider && (await bcrypt.compare(password, provider.password))) {
        res.json({ _id: provider._id, name: provider.name, email: provider.email, token: generateToken(provider._id) });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc   Request a password reset OTP
// @route  POST /api/providers/forgot-password
// @access Public
export const requestPasswordResetOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const provider = await ServiceProvider.findOne({ email });

    if (!provider) {
        res.status(404);
        throw new Error('No provider found with this email.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    provider.resetPasswordOtp = otp;
    provider.resetPasswordOtpExpires = Date.now() + 2 * 60 * 1000;
    await provider.save();

    await sendEmail(email, 'Your Password Reset OTP', `Your OTP to reset your AnandUtsav provider password is: ${otp}`);
    res.status(200).json({ message: `Password reset OTP sent to ${email}` });
});

// @desc   Reset provider password using OTP
// @route  POST /api/providers/reset-password
// @access Public
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const provider = await ServiceProvider.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordOtpExpires: { $gt: Date.now() },
    });

    if (!provider) {
        res.status(400);
        throw new Error('Invalid OTP or OTP has expired.');
    }
    
    provider.password = await bcrypt.hash(newPassword, 10);
    provider.resetPasswordOtp = undefined;
    provider.resetPasswordOtpExpires = undefined;
    await provider.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
});

// @desc   Get a provider's public profile by ID
// @route  GET /api/providers/:id
// @access Public
export const getProviderProfileById = asyncHandler(async (req, res) => {
    const provider = await ServiceProvider.findById(req.params.id)
        .select('-password -resetPasswordOtp -resetPasswordOtpExpires')
        .populate('services', 'name images priceInfo');

    if (provider) {
        res.json(provider);
    } else {
        res.status(404);
        throw new Error('Service Provider not found.');
    }
});
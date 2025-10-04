import ServiceProvider from '../models/ServiceProvider.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/SendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerProvider = async (req, res) => {
  try {
    const { name, email, phone, location, password } = req.body;
    const providerExists = await ServiceProvider.findOne({ email });
    if (providerExists) {
      return res.status(400).json({ success: false, message: 'Service Provider with this email already exists.' });
    }

    const phoneExists = await ServiceProvider.findOne({ phone });
    if (phoneExists) {
        return res.status(400).json({ success: false, message: 'This phone number is already in use.' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const provider = await ServiceProvider.create({ name, email, phone, location, password: hashedPassword });
    res.status(201).json({ _id: provider._id, name: provider.name, email: provider.email, token: generateToken(provider._id) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    const provider = await ServiceProvider.findOne({ email });
    if (provider && (await bcrypt.compare(password, provider.password))) {
      res.json({ _id: provider._id, name: provider.name, email: provider.email, token: generateToken(provider._id) });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const provider = await ServiceProvider.findOne({ email });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'No provider found with this email.' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    provider.resetPasswordOtp = otp;
    provider.resetPasswordOtpExpires = Date.now() + 2 * 60 * 1000;
    await provider.save();
    await sendEmail(email, 'Your Password Reset OTP', `Your OTP is: ${otp}`);
    res.status(200).json({ message: `Password reset OTP sent to ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const provider = await ServiceProvider.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() },
    });
    if (!provider) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or OTP has expired.' });
    }
    provider.password = await bcrypt.hash(newPassword, 10);
    provider.resetPasswordOtp = undefined;
    provider.resetPasswordOtpExpires = undefined;
    await provider.save();
    res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderProfileById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .select('-password -resetPasswordOtp -resetPasswordOtpExpires')
      .populate('services', 'name images priceInfo');
    if (provider) {
      res.json(provider);
    } else {
      return res.status(404).json({ success: false, message: 'Service Provider not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
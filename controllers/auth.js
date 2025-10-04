// /controllers/auth.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/SendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const requestRegistrationOTP = async (req, res) => {
  try {
    const { email, fullName, username, phone, location } = req.body;
    if (!email) { return res.status(400).json({ success: false, message: 'Please provide an email.'}); }
    // ... similar checks for all fields ...

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser && existingUser.isVerified) {
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ success: false, message: 'This username is already taken.' });
      }
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
        return res.status(400).json({ success: false, message: 'This phone number is already in use.' });
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 2 * 60 * 1000;
    let user = existingUser || new User({ email, username, isVerified: false });
    user.fullName = fullName;
    user.phone = phone;
    user.location = location;
    user.Otp = otp;
    user.OtpExpireAt = otpExpires;
    await user.save();
    await sendEmail(email, 'Verify Your Email for AnandUtsav', `Your verification OTP is: ${otp}`);
    res.status(200).json({ message: `Verification OTP sent to ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmailAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, Otp: otp, OtpExpireAt: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or OTP has expired.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'This account has already been verified.' });
    }
    user.isVerified = true;
    user.Otp = undefined;
    user.OtpExpireAt = undefined;
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Account verified successfully!', _id: user._id, fullName: user.fullName, email: user.email, token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(404).json({ success: false, message: 'No verified account found with this email.' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 2 * 60 * 1000;
    user.Otp = otp;
    user.OtpExpireAt = otpExpires;
    await user.save();
    await sendEmail(email, 'Your AnandUtsav Login OTP', `Your login OTP is: ${otp}`);
    res.status(200).json({ message: `Login OTP has been sent to ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOTPAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, Otp: otp, OtpExpireAt: { $gt: Date.now() } });
    if (!user || !user.isVerified) {
      return res.status(401).json({ success: false, message: 'Invalid OTP or OTP has expired.' });
    }
    user.Otp = undefined;
    user.OtpExpireAt = undefined;
    await user.save();
    const token = generateToken(user._id);
    res.json({
      message: "Login successful!", _id: user._id, fullName: user.fullName, email: user.email, token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
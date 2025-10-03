import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/SendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// =================================
// == REGISTRATION FLOW           ==
// =================================
export const requestRegistrationOTP = asyncHandler(async (req, res) => {
  const { email, fullName, username, phone, location } = req.body;

  if (!email) { throw new Error('Please provide an email.'); }
  if (!fullName) { throw new Error('Please provide your full name.'); }
  if (!username) { throw new Error('Please provide a username.'); }
  if (!phone) { throw new Error('Please provide a phone number.'); }
  if (!location) { throw new Error('Please provide a location.'); }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  
  if (existingUser && existingUser.isVerified) {
    if (existingUser.email === email) {
      res.status(400);
      throw new Error('An account with this email already exists.');
    }
    if (existingUser.username === username) {
      res.status(400);
      throw new Error('This username is already taken.');
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 2 * 60 * 1000;

  let userToUpdateOrCreate = existingUser && !existingUser.isVerified ? existingUser : new User({ email, username, isVerified: false });
  
  userToUpdateOrCreate.fullName = fullName;
  userToUpdateOrCreate.phone = phone;
  userToUpdateOrCreate.location = location;
  userToUpdateOrCreate.Otp = otp;
  userToUpdateOrCreate.OtpExpireAt = otpExpires;
  
  await userToUpdateOrCreate.save();

  await sendEmail(email, 'Verify Your Email for AnandUtsav', `Your verification OTP is: ${otp}`);
  res.status(200).json({ message: `Verification OTP sent to ${email}` });
});


export const verifyEmailAndRegister = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    Otp: otp,
    OtpExpireAt: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400);
    throw new Error('Invalid OTP or OTP has expired.');
  }
  if (user.isVerified) {
    res.status(400);
    throw new Error('This account has already been verified.');
  }
  user.isVerified = true;
  user.Otp = undefined;
  user.OtpExpireAt = undefined;
  await user.save();
  const token = generateToken(user._id);
  res.status(201).json({
    message: 'Account verified successfully! You are now logged in.',
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    token,
  });
});


// =================================
// == LOGIN FLOW                  ==
// =================================
export const sendLoginOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
        res.status(404); // <-- THIS LINE IS NOW CORRECTED
        throw new Error('No verified account found with this email.');
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 2 * 60 * 1000;
    user.Otp = otp;
    user.OtpExpireAt = otpExpires;
    await user.save();
    
    await sendEmail(email, 'Your AnandUtsav Login OTP', `Your login OTP is: ${otp}`);
    res.status(200).json({ message: `Login OTP has been sent to ${email}` });
});


export const verifyOTPAndLogin = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({
        email,
        Otp: otp,
        OtpExpireAt: { $gt: Date.now() },
    });
    if (!user || !user.isVerified) {
        res.status(401);
        throw new Error('Invalid OTP or OTP has expired.');
    }
    user.Otp = undefined;
    user.OtpExpireAt = undefined;
    await user.save();
    const token = generateToken(user._id);
    res.json({
        message: "Login successful!",
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token,
    });
});
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/SendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};



// == REGISTRATION FLOW           

export const requestRegistrationOTP = asyncHandler(async (req, res) => {
  const { email, fullName, username, phone, location } = req.body;

  // --- NEW: Individual checks for each required field ---
  if (!email) {
    res.status(400);
    throw new Error('Please provide an email.');
  }
  if (!fullName) {
    res.status(400);
    throw new Error('Please provide your full name.');
  }
  if (!username) {
    res.status(400);
    throw new Error('Please provide a username.');
  }
  if (!phone) {
    res.status(400);
    throw new Error('Please provide a phone number.');
  }
  if (!location) {
    res.status(400);
    throw new Error('Please provide a location.');
  }
  // --- END of new checks ---

  const emailExists = await User.findOne({ email, isVerified: true });
  if (emailExists) {
    res.status(400);
    throw new Error('An account with this email already exists.');
  }

  const usernameExists = await User.findOne({ username, isVerified: true });
  if (usernameExists) {
    res.status(400);
    throw new Error('This username is already taken.');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 2 * 60 * 1000;

  let user = await User.findOne({ email, isVerified: false });
  if (user) {
    user.fullName = fullName;
    user.username = username;
    user.phone = phone;
    user.location = location;
    user.Otp = otp;
    user.OtpExpireAt = otpExpires;
  } else {
    user = new User({
      email, fullName, username, phone, location,
      Otp: otp, OtpExpireAt: otpExpires, isVerified: false
    });
  }
  await user.save();

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

// == LOGIN FLOW      

export const sendLoginOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
        res.status(404);
        throw new Error('No verified account found with this email.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 2 * 60 * 1000;

    user.Otp = otp;
    user.OtpExpireAt = otpExpires;
    await user.save();

    await sendEmail(user.email, 'Your AnandUtsav Login OTP', `Your login OTP is: ${otp}`);
    res.status(200).json({ message: `Login OTP has been sent to ${user.email}` });
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
// /controllers/auth.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/SendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc   Register a new user
// @route  POST /api/users/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password, phone, location } = req.body;

  if (!username || !fullName || !email || !password || !phone || !location) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    res.status(400);
    throw new Error('User with that email or username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username, fullName, email, password: hashedPassword, phone, location,
  });

  if (user) {
    const token = generateToken(user._id);
    await sendEmail(
      user.email,
      "Welcome to AnandUtsav 🎉",
      `Hello ${user.fullName}, welcome to our platform!`,
      `<h2>Hello ${user.fullName}</h2><p>Welcome to <b>AnandUtsav</b> 🎉</p>`
    );

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc   Authenticate user & get token
// @route  POST /api/users/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    await sendEmail(
      user.email,
      "Login Alert for AnandUtsav 🔑",
      `Hello ${user.fullName}, you just logged into your account.`,
      `<p>Hello ${user.fullName},</p><p>You logged into your <b>AnandUtsav</b> account on ${new Date().toLocaleString()}.</p>`
    );
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
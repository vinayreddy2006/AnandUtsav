// /controllers/user.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// @desc   Get current user profile
// @route  GET /api/users/me
// @access Private
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.username = req.body.username || user.username;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
      phone: updatedUser.phone,
      location: updatedUser.location,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc   Change user password
// @route  PUT /api/users/change-password
// @access Private
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Old password is incorrect');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: 'Password changed successfully' });
});

// @desc   Delete user account
// @route  DELETE /api/users/account
// @access Private
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    await user.deleteOne();
    res.status(200).json({ message: 'User account deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// --- Favorites ---
export const getUserFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favorites',
    populate: { path: 'category', select: 'name slug' }
  });
  res.json(user.favorites);
});

export const addFavorite = asyncHandler(async (req, res) => {
  const { serviceId } = req.body;
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: serviceId } });
  res.status(201).json({ message: 'Added to favorites' });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: serviceId } });
  res.json({ message: 'Removed from favorites' });
});


import User from '../models/User.js';

export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
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
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      await user.deleteOne();
      res.status(200).json({ success: true, message: 'User account deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: { path: 'category', select: 'name slug' }
    });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { serviceId } = req.body;
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: serviceId } });
    res.status(201).json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { serviceId } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: serviceId } });
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
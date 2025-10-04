import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ServiceProvider from '../models/ServiceProvider.js';

const protectAll = async (req, res, next) => {
  let token;

  if (!(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 1. First, try to find a regular User
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user; // Attach user to the request
      return next();   // Success! Continue to the controller.
    }

    // 2. If no user, try to find a Service Provider
    const provider = await ServiceProvider.findById(decoded.id).select('-password');
    if (provider) {
      req.provider = provider; // Attach provider to the request
      return next();           // Success! Continue to the controller.
    }

    // 3. If neither was found, the token is invalid
    return res.status(401).json({ success: false, message: 'Not authorized, token holder not found' });

  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

export { protectAll };
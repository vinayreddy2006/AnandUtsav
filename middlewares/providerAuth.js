// /middlewares/providerAuth.js
import jwt from 'jsonwebtoken';
import ServiceProvider from '../models/ServiceProvider.js';

export const protectProvider = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.provider = await ServiceProvider.findById(decoded.id).select('-password');
      if (!req.provider) {
        return res.status(401).json({ success: false, message: 'Not authorized, provider not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};
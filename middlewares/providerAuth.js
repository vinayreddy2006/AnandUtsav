import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import ServiceProvider from '../models/ServiceProvider.js';

const protectProvider = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the provider to the request, not a regular user
      req.provider = await ServiceProvider.findById(decoded.id).select('-password');
      
      if (!req.provider) {
        res.status(401);
        throw new Error('Not authorized, provider not found');
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protectProvider };
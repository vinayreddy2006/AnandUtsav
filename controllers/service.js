// /controllers/service.js
import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';

// @desc   Fetch all services
// @route  GET /api/services
// @access Public
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({}).populate('category', 'name slug');
  res.json(services);
});

// @desc   Fetch a limited number of services for the homepage
// @route  GET /api/services/preview
// @access Public
export const getServicePreview = asyncHandler(async (req, res) => {
  const services = await Service.find({}).limit(7).populate('category', 'name slug');
  res.json(services);
});

// @desc   Fetch a single service by ID
// @route  GET /api/services/:id
// @access Public
export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('category', 'name slug');
  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});
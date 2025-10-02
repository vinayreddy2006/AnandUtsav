// /controllers/service.js
import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import ServiceProvider from '../models/ServiceProvider.js';

// @desc   Create a new Service (by a logged-in provider)
// @route  POST /api/services
// @access Private/Provider
export const createService = asyncHandler(async (req, res) => {
  const { name, description, images, priceInfo, categoryId, providerId } = req.body;
  const provider = await ServiceProvider.findById(providerId); // Assuming providerId is sent for now

  if (!provider) {
    res.status(404);
    throw new Error('Service Provider not found.');
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found.');
  }

  const service = await Service.create({
    name, description, images, priceInfo,
    categories: categoryId,
    providers: providerId,
  });

  category.services.push(service._id);
  await category.save();
  
  provider.services.push(service._id);
  await provider.save();

  res.status(201).json(service);
});


// @desc   Fetch all services
// @route  GET /api/services
// @access Public
export const getServices = asyncHandler(async (req, res) => {
  // --- THIS IS THE MISSING LOGIC ---
  const services = await Service.find({})
    .populate('categories', 'name slug')
    .populate('providers', 'name location');
  
  res.json(services);
  // --- END OF MISSING LOGIC ---
});


// @desc   Fetch a single service by ID
// @route  GET /api/services/:id
// @access Public
export const getServiceById = asyncHandler(async (req, res) => {
  // --- THIS IS THE MISSING LOGIC ---
  const service = await Service.findById(req.params.id)
    .populate('categories', 'name slug')
    .populate('providers', 'name location email phone');
    
  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
  // --- END OF MISSING LOGIC ---
});
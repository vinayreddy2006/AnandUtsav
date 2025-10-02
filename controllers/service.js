// /controllers/service.js
import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import ServiceProvider from '../models/ServiceProvider.js';

// Helper function to create a URL-friendly slug from a name
const generateSlug = (name) => {
  return name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
};


// @desc   Create a new Service (by a logged-in provider)
// @route  POST /api/services
// @access Private/Provider
export const createService = asyncHandler(async (req, res) => {
  const { name, description, images, priceInfo, categoryName } = req.body;
  
  if (!name || !priceInfo || !categoryName) {
    res.status(400);
    throw new Error('Please provide name, price, and a category name');
  }

  let category = await Category.findOne({ name: categoryName });

  if (!category) {
    // If category doesn't exist, create it automatically
    category = await Category.create({
      name: categoryName,
      slug: generateSlug(categoryName),
    });
  }

  const providerId = req.provider._id;
  const service = await Service.create({
    name, description, images, priceInfo,
    categories: category._id,
    providers: providerId,
  });

  const provider = await ServiceProvider.findById(providerId);
  provider.services.push(service._id);
  await provider.save();
  
  category.services.push(service._id);
  await category.save();

  res.status(201).json(service);
});



// @desc   Fetch all services
// @route  GET /api/services
// @access Public
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({})
    .populate('categories', 'name slug')
    .populate('providers', 'name location');
 
  res.json(services);
});

// @desc   Fetch a single service by ID
// @route  GET /api/services/:id
// @access Public
export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
    .populate('categories', 'name slug')
    .populate('providers', 'name location email phone');
    
  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});
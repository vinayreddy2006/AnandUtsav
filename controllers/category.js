// /controllers/category.js
import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';
import Category from '../models/Category.js';

// @desc   Fetch all categories with their details
// @route  GET /api/categories
// @access Public
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc   Fetch services by category slug
// @route  GET /api/categories/:slug/services
// @access Public
export const getServicesByCategorySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (category) {
    const services = await Service.find({ category: category._id }).populate('category', 'name slug');
    res.json(services);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});
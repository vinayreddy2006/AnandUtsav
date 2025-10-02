import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import Service from '../models/Service.js';
import Category from '../models/Category.js';

export const createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required.');
  }
  
  // This is the correct line for slug generation
  const slug = slugify(name, { lower: true, strict: true });

  const categoryExists = await Category.findOne({ $or: [{ name }, { slug }] });

  if (categoryExists) {
    res.status(200).json(categoryExists);
    return;
  }

  const category = await Category.create({
    name,
    image,
    slug,
  });

  res.status(201).json(category);
});

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
    const services = await Service.find({ categories: category._id }).populate('categories', 'name slug');
    res.json(services);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});
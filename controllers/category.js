// /controllers/category.js
import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';
import Category from '../models/Category.js';

const generateSlug = (name) => {
  return name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

// @desc   Create a new category (for seeding/admin)
// @route  POST /api/categories
// @access Public
export const createCategory = asyncHandler(async (req, res) => {
    const { name, image } = req.body;
    
    // --- NOTE: This check is important and has been kept ---
    const categoryExists = await Category.findOne({ name });
    if(categoryExists) {
        res.status(400);
        throw new Error('Category with this name already exists.');
    }

    const category = await Category.create({
        name,
        image: image || '/images/categories/default.jpg',
        slug: generateSlug(name),
    });

    res.status(201).json(category);
});

// (The other functions in this file remain the same)
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});
export const getServicesByCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (category) {
    const services = await Service.find({ categories: category._id });
    res.json(services);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});
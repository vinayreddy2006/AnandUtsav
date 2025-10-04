import Service from '../models/Service.js';
import Category from '../models/Category.js';

const generateSlug = (name) => {
  return name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists.' });
    }
    const category = await Category.create({
      name,
      image: image || '/images/categories/default.jpg',
      slug: generateSlug(name),
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServicesByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (category) {
      const services = await Service.find({ categories: category._id });
      res.json(services);
    } else {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
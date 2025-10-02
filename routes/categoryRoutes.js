// /routes/categoryRoutes.js
import express from 'express';
import {
  getAllCategories,
  getServicesByCategory,
  createCategory, // Added for admin/seeding purposes
} from '../controllers/category.js';

const router = express.Router();

router.route('/').get(getAllCategories).post(createCategory); // Added POST for creation
router.route('/:slug/services').get(getServicesByCategory);

export default router;
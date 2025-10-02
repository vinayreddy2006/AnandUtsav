import express from 'express';
import {
  getAllCategories,
  getServicesByCategorySlug,
  createCategory,
} from '../controllers/category.js';

const router = express.Router();

router.route('/').get(getAllCategories).post(createCategory);
router.route('/:slug/services').get(getServicesByCategorySlug);

export default router;
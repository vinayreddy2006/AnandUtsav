// /routes/categoryRoutes.js
import express from 'express';
import {
  getAllCategories,
  getServicesByCategorySlug,
} from '../controllers/category.js';

const router = express.Router();

router.route('/').get(getAllCategories);
router.route('/:slug/services').get(getServicesByCategorySlug);

export default router;
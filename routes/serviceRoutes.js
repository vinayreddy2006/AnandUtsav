// /routes/serviceRoutes.js
import express from 'express';
import {
  getServices,
  getServiceById,
  getServicePreview,
} from '../controllers/service.js';

const router = express.Router();

router.route('/').get(getServices);
router.route('/preview').get(getServicePreview);
router.route('/:id').get(getServiceById);

export default router;
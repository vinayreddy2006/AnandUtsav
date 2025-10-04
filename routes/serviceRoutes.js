import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService 
} from '../controllers/service.js';
import { protectProvider } from '../middlewares/providerAuth.js';

const router = express.Router();

router.route('/')
    .post(protectProvider, createService)
    .get(getServices);

router.route('/:id')
    .get(getServiceById)
    .put(protectProvider, updateService)
    .delete(protectProvider, deleteService);

export default router;
// /routes/reviewRoutes.js
import express from "express";
import { protect } from "../middlewares/auth.js";
import { 
    addReview, 
    deleteReview, 
    getServiceReviews, 
    getUserReviews 
} from "../controllers/review.js";

const router = express.Router();

router.post('/', protect, addReview);
router.delete('/:reviewId', protect, deleteReview);
router.get('/user', protect, getUserReviews);
router.get('/service/:serviceId', getServiceReviews);

export default router;
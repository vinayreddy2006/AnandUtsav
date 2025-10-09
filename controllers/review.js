// /controllers/review.js
import Service from '../models/Service.js';
import Review from '../models/Review.js';

export const addReview = async (req, res) => {
  try {
    const { serviceId, rating, review } = req.body;
    const userId = req.user._id;

    if (!serviceId || !rating) {
      return res.status(400).json({ success: false, message: "Service ID and rating are required" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const reviewDoc = await Review.findOneAndUpdate(
      { user: userId, service: serviceId },
      { rating, review },
      { new: true, upsert: true }
    );

    // Recalculate average rating and count
    const allReviews = await Review.find({ service: serviceId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    // --- THIS IS THE FIX ---
    // Use findByIdAndUpdate to update the service directly
    await Service.findByIdAndUpdate(serviceId, {
      avgRating: avgRating.toFixed(1),
      reviewCount: allReviews.length
    });
    // --- END OF FIX ---

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: reviewDoc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findOneAndDelete({ _id: reviewId, user: req.user._id });

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found or you're not authorized" });
    }

    // Update the service's stats after deletion
    const service = await Service.findById(review.service);
    if (service) {
      const remainingReviews = await Review.find({ service: service._id });
      const avgRating = remainingReviews.length > 0
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
        : 0;
      
      // --- THIS IS THE FIX (Applied here as well) ---
      await Service.findByIdAndUpdate(review.service, {
        avgRating: avgRating.toFixed(1),
        reviewCount: remainingReviews.length
      });
    }

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId).select("name avgRating reviewCount");
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const reviews = await Review.find({ service: serviceId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      service,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await Review.find({ user: userId })
      .populate("service", "name avgRating")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
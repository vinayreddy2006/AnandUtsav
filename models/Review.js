// /models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the user who gave the review
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Refers to the service being reviewed
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// This ensures a user can only review a specific service once.
reviewSchema.index({ user: 1, service: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
  rating: { type: Number, min: 0, max: 10, required: true },
  comment: { type: String, trim: true }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
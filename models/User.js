// /models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  
  isVerified: {  type: Boolean, default: false, required: true, },
  Otp: { type: String,},
  OtpExpireAt: { type: Number,},
  
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  previousBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  cart: [{
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
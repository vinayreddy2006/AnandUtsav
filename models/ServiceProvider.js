import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  location: { type: String, required: true },

  password: { type: String, required: true },
  resetPasswordOtp: { type: String },
  resetPasswordOtpExpires: { type: Number },
  
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  previousProjects: [{
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String }
  }],
}, { timestamps: true });

const ServiceProvider = mongoose.model("ServiceProvider", serviceProviderSchema);
export default ServiceProvider;
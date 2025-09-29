import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Catering",
      "Decorations",
      "Photography",
      "Videography",
      "Beauty & Makeup",
      "Fashion & Attire",
      "Invitations",
      "Venues",
      "Entertainment",
      "Music Bands",
      "DJs",
      "Travel",
      "Transport",
      "Event Planning",
      "Florists",
      "Production (Sound & Lights)",
      "Fireworks",
      "Mehndi Artists",
      "Gifting",
      "Jewellery"
    ],
    required: true
  },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  phone: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  previousProjects: [{
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String }
  }],
  rating: { type: Number, default: 0 }
}, { timestamps: true });

const ServiceProvider = mongoose.model("ServiceProvider", serviceProviderSchema);
export default ServiceProvider;
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    ]
  },
  
  slug: {
    type: String,
    lowercase: true,
  },

  image: {
    type: String,
  },

services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]

}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
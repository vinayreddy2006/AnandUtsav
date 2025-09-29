// /models/categoryModel.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
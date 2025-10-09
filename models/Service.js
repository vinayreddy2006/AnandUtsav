import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },

  images: [{ type: String }],

  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  providers: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' },

  priceInfo: {
    amount: { type: Number, required: true },
    unit: { type: String, default: 'per event' },
  },
  avgRating:{
    type:Number,
    default:0
  },
  reviewCount: {
      type: Number,
      default: 0,
    },
  availability: { type: Boolean, default: true },

}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
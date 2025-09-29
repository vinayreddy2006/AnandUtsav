// /models/bookingModel.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  occasionType: { type: String, trim: true },
  slot: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
  },
  bookingStatus: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
  payment: {
    total: { type: Number, required: true },
    paid: { type: Number, default: 0 },
    balance: { type: Number, default: function () { return this.total - this.paid } },
    status: { type: String, enum: ["Pending", "Completed", "Partial"], default: "Pending" }
  }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
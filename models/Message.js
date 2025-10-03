import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'ServiceProvider']
  },
  content: { type: String, trim: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  isRead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
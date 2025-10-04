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
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  isRead: { type: Boolean, default: false },

  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file'],
    default: 'text'
  },
  content: { 
    type: String,
    required: true
  }
}, { timestamps: true });

messageSchema.index({ conversation: 1, isRead: 1, sender: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
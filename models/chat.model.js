const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  content: {
    type: String,
    required: ['Please provide a content of chat!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'A chat must be belong to a user!',
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: 'A chat must be belong to a room!',
  },
  photos: [String],
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date
}, {
  timestamps: true,
  toJson: { virtuals: true },
  toObject: { viruals: true }
})

chatSchema.pre('findByIdAndUpdate', function (next) {
  if (this.isModified('deleted')) {
    this.deletedAt = Date.now();
  }

  next();
})

const Chat = mongoose.model('Chat', chatSchema, 'chats');

module.exports = Chat;

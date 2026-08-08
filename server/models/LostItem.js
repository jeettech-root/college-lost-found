const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    dateLost: {
      type: Date,
      required: [true, 'Date lost is required']
    },
    image: {
      type: String,
      trim: true
    },
    reward: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['active', 'claimed', 'resolved'],
      default: 'active'
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LostItem', lostItemSchema);
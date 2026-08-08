const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema(
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
    dateFound: {
      type: Date,
      required: [true, 'Date found is required']
    },
    image: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'claimed', 'resolved'],
      default: 'active'
    },
    finderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Finder is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('FoundItem', foundItemSchema);
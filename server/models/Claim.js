const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Item ID is required']
    },
    itemType: {
      type: String,
      required: [true, 'Item type is required'],
      enum: ['lost', 'found']
    },
    claimerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Claimer ID is required'],
      ref: 'User'
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    proofImage: {
      type: String
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Claim', claimSchema);

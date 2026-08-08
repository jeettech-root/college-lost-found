const mongoose = require('mongoose');
const Claim = require('../models/Claim');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

const createClaim = async (req, res) => {
  try {
    const { itemId, itemType, message, proofImage } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    if (!itemType) {
      return res.status(400).json({
        success: false,
        message: 'Item type is required'
      });
    }

    if (!['lost', 'found'].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: 'Item type must be either lost or found'
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID'
      });
    }

    let item;
    let ownerField;

    if (itemType === 'lost') {
      item = await LostItem.findById(itemId);
      ownerField = 'ownerId';
    } else {
      item = await FoundItem.findById(itemId);
      ownerField = 'finderId';
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const ownerId = item[ownerField]?.toString();
    const claimerId = req.user._id.toString();

    if (ownerId === claimerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot claim your own item'
      });
    }

    const existingClaim = await Claim.findOne({
      itemId,
      itemType,
      claimerId: req.user._id,
      status: 'pending'
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'A pending claim already exists for this item'
      });
    }

    await Claim.create({
      itemId,
      itemType,
      claimerId: req.user._id,
      message: message.trim(),
      proofImage,
      status: 'pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Claim created successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createClaim
};

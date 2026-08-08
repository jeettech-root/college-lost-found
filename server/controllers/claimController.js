const mongoose = require('mongoose');
const Claim = require('../models/Claim');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

const getItemModel = (itemType) => {
  if (itemType === 'lost') {
    return LostItem;
  }

  if (itemType === 'found') {
    return FoundItem;
  }

  return null;
};

const getOwnershipField = (itemType) => {
  if (itemType === 'lost') {
    return 'ownerId';
  }

  if (itemType === 'found') {
    return 'finderId';
  }

  return null;
};

const buildReceivedClaimPayload = (claim, itemTitle) => ({
  _id: claim._id,
  itemId: claim.itemId,
  itemType: claim.itemType,
  itemTitle,
  claimerName: claim.claimerId?.name || null,
  claimerEmail: claim.claimerId?.email || null,
  message: claim.message,
  proofImage: claim.proofImage,
  status: claim.status,
  createdAt: claim.createdAt
});

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

const getReceivedClaims = async (req, res) => {
  try {
    const [lostItems, foundItems] = await Promise.all([
      LostItem.find({ ownerId: req.user._id }).select('_id title'),
      FoundItem.find({ finderId: req.user._id }).select('_id title')
    ]);

    const lostItemTitles = new Map(lostItems.map((item) => [item._id.toString(), item.title]));
    const foundItemTitles = new Map(foundItems.map((item) => [item._id.toString(), item.title]));

    const [lostClaims, foundClaims] = await Promise.all([
      Claim.find({
        itemType: 'lost',
        itemId: { $in: lostItems.map((item) => item._id) }
      })
        .sort({ createdAt: -1 })
        .populate('claimerId', 'name email'),
      Claim.find({
        itemType: 'found',
        itemId: { $in: foundItems.map((item) => item._id) }
      })
        .sort({ createdAt: -1 })
        .populate('claimerId', 'name email')
    ]);

    const claims = [...lostClaims, ...foundClaims]
      .sort((leftClaim, rightClaim) => rightClaim.createdAt.getTime() - leftClaim.createdAt.getTime())
      .map((claim) => {
        const itemTitle = claim.itemType === 'lost'
          ? lostItemTitles.get(claim.itemId.toString())
          : foundItemTitles.get(claim.itemId.toString());

        return buildReceivedClaimPayload(claim, itemTitle || null);
      });

    return res.json({
      success: true,
      claims
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateClaim = async (req, res) => {
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid claim ID'
    });
  }

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be either approved or rejected'
    });
  }

  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending claims can be updated'
      });
    }

    const itemModel = getItemModel(claim.itemType);
    const ownershipField = getOwnershipField(claim.itemType);

    if (!itemModel || !ownershipField) {
      return res.status(400).json({
        success: false,
        message: 'Invalid claim item type'
      });
    }

    const item = await itemModel.findById(claim.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Related item not found'
      });
    }

    if (item[ownershipField].toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to review this claim'
      });
    }

    const previousClaimStatus = claim.status;
    const previousItemStatus = item.status;

    claim.status = status;
    await claim.save();

    if (status === 'approved') {
      item.status = 'resolved';
      await item.save();

      await Claim.updateMany(
        {
          _id: { $ne: claim._id },
          itemId: claim.itemId,
          itemType: claim.itemType,
          status: 'pending'
        },
        {
          $set: { status: 'rejected' }
        }
      );
    } else {
      item.status = previousItemStatus;
      await item.save();
    }

    return res.json({
      success: true,
      message: status === 'approved' ? 'Claim approved successfully' : 'Claim rejected successfully',
      claim
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createClaim,
  getReceivedClaims,
  updateClaim
};

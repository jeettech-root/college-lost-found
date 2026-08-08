const LostItem = require('../models/LostItem');

const isValidDate = (value) => {
  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
};

const normalizeReward = (value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  const rewardValue = Number(value);
  return Number.isNaN(rewardValue) ? null : rewardValue;
};

const getLostItems = async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 }).populate('ownerId', 'name email role');

    return res.json({
      success: true,
      items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getLostItemById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id).populate('ownerId', 'name email role');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    return res.json({
      success: true,
      item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createLostItem = async (req, res) => {
  try {
    const { title, category, description, location, dateLost, image, status } = req.body;
    const reward = normalizeReward(req.body.reward);

    if (!title || !category || !description || !location || !dateLost) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, description, location, and date lost are required'
      });
    }

    if (!isValidDate(dateLost)) {
      return res.status(400).json({
        success: false,
        message: 'Date lost must be a valid date'
      });
    }

    if (reward === null) {
      return res.status(400).json({
        success: false,
        message: 'Reward must be a valid number'
      });
    }

    if (status && !['active', 'claimed', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const item = await LostItem.create({
      title,
      category,
      description,
      location,
      dateLost,
      image,
      reward,
      status: status || 'active',
      ownerId: req.user._id
    });

    return res.status(201).json({
      success: true,
      item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    if (item.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own lost items'
      });
    }

    const { title, category, description, location, dateLost, image, status } = req.body;
    const reward = normalizeReward(req.body.reward);

    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description;
    if (location !== undefined) item.location = location;
    if (dateLost !== undefined) {
      if (!isValidDate(dateLost)) {
        return res.status(400).json({
          success: false,
          message: 'Date lost must be a valid date'
        });
      }

      item.dateLost = dateLost;
    }
    if (image !== undefined) item.image = image;
    if (req.body.reward !== undefined) {
      if (reward === null) {
        return res.status(400).json({
          success: false,
          message: 'Reward must be a valid number'
        });
      }

      item.reward = reward;
    }
    if (status !== undefined) {
      if (!['active', 'claimed', 'resolved'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }

      item.status = status;
    }

    const updatedItem = await item.save();

    return res.json({
      success: true,
      item: updatedItem
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    if (item.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own lost items'
      });
    }

    await item.deleteOne();

    return res.json({
      success: true,
      message: 'Lost item deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getLostItems,
  getLostItemById,
  createLostItem,
  updateLostItem,
  deleteLostItem
};
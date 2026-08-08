const FoundItem = require('../models/FoundItem');

const isValidDate = (value) => {
  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
};

const buildSearchQuery = (query) => {
  const filter = {};

  if (query.search) {
    const escapedSearch = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: escapedSearch, $options: 'i' } },
      { category: { $regex: escapedSearch, $options: 'i' } },
      { location: { $regex: escapedSearch, $options: 'i' } },
      { description: { $regex: escapedSearch, $options: 'i' } }
    ];
  }

  if (query.category) {
    filter.category = { $regex: `^${query.category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' };
  }

  if (query.location) {
    filter.location = { $regex: query.location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  }

  if (query.status) {
    filter.status = query.status;
  }

  return filter;
};

const getFoundItems = async (req, res) => {
  try {
    const query = buildSearchQuery(req.query);
    const items = await FoundItem.find(query)
      .sort({ createdAt: -1 })
      .populate('finderId', 'name email role');

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

const getFoundItemById = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id).populate('finderId', 'name email role');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
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

const createFoundItem = async (req, res) => {
  try {
    const { title, category, description, location, dateFound, image, status } = req.body;

    if (!title || !category || !description || !location || !dateFound) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, description, location, and date found are required'
      });
    }

    if (!isValidDate(dateFound)) {
      return res.status(400).json({
        success: false,
        message: 'Date found must be a valid date'
      });
    }

    if (status && !['active', 'claimed', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const item = await FoundItem.create({
      title,
      category,
      description,
      location,
      dateFound,
      image,
      status: status || 'active',
      finderId: req.user._id
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

const updateFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    if (item.finderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own found items'
      });
    }

    const { title, category, description, location, dateFound, image, status } = req.body;

    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description;
    if (location !== undefined) item.location = location;
    if (dateFound !== undefined) {
      if (!isValidDate(dateFound)) {
        return res.status(400).json({
          success: false,
          message: 'Date found must be a valid date'
        });
      }

      item.dateFound = dateFound;
    }
    if (image !== undefined) item.image = image;
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

const deleteFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    if (item.finderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own found items'
      });
    }

    await item.deleteOne();

    return res.json({
      success: true,
      message: 'Found item deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getFoundItems,
  getFoundItemById,
  createFoundItem,
  updateFoundItem,
  deleteFoundItem
};
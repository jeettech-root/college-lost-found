const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getLostItems,
  getLostItemById,
  createLostItem,
  updateLostItem,
  deleteLostItem
} = require('../controllers/lostController');

const router = express.Router();

router.get('/', getLostItems);
router.get('/:id', getLostItemById);
router.post('/', protect, createLostItem);
router.put('/:id', protect, updateLostItem);
router.delete('/:id', protect, deleteLostItem);

module.exports = router;
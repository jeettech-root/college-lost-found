const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getFoundItems,
  getFoundItemById,
  createFoundItem,
  updateFoundItem,
  deleteFoundItem
} = require('../controllers/foundController');

const router = express.Router();

router.get('/', getFoundItems);
router.get('/:id', getFoundItemById);
router.post('/', protect, createFoundItem);
router.put('/:id', protect, updateFoundItem);
router.delete('/:id', protect, deleteFoundItem);

module.exports = router;
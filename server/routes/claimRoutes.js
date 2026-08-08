const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createClaim } = require('../controllers/claimController');

const router = express.Router();

router.post('/', protect, createClaim);

module.exports = router;

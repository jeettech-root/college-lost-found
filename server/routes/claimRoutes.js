const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
	createClaim,
	getReceivedClaims,
	updateClaim
} = require('../controllers/claimController');

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/received', protect, getReceivedClaims);
router.put('/:id', protect, updateClaim);

module.exports = router;

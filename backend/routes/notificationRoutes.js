const express = require('express')
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/', protect, getNotifications);
router.patch('/:notificationId', protect, markAsRead);

module.exports = router;
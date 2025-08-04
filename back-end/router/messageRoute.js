const express = require('express');
const router = express.Router();
const  protect  = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controller/messageController');



router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);



module.exports = router;
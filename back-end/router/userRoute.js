// /routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateMentorprofile, getLoggedUser } = require('../controller/userController');
const protect = require('../middleware/authMiddleware');

router.get('/profile', protect, getLoggedUser);
router.put('/updateprofile', protect, updateMentorprofile);

module.exports = router;

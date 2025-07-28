// /routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateMentorprofile, getLoggedUser, updateStudentProfile } = require('../controller/userController');
const protect = require('../middleware/authMiddleware');

router.get('/profile', protect, getLoggedUser);
router.put('/updateprofile', protect, updateMentorprofile);
router.put('/studentprofile',protect,updateStudentProfile)

module.exports = router;

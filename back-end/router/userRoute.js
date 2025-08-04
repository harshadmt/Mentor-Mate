const express = require('express');
const router = express.Router();
const { updateMentorprofile, getLoggedUser, updateStudentProfile, getAllMentorWithSkill, getMentorDetailsById } = require('../controller/userController');
const protect = require('../middleware/authMiddleware');

router.get('/profile', protect, getLoggedUser);
router.put('/updateprofile', protect, updateMentorprofile);
router.put('/studentprofile',protect,updateStudentProfile)
router.get('/student/mentor', protect, getAllMentorWithSkill);



module.exports = router;
 
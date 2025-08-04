const express = require('express');
const router = express.Router();
const { getStudentsByMentor, getStudentById } = require('../controller/mentorController');
const protect = require('../middleware/authMiddleware');


router.get('/students', protect, getStudentsByMentor);


router.get('/student/:studentId', protect, getStudentById);

module.exports = router;

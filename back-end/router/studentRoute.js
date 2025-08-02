const express = require('express');
const {
  getUnlockedRoadmaps,
  getSingleUnlockedRoadmap,
  getMentorsForPurchasedRoadmaps,
  getMentorDetailsById,
} = require('../controller/studentController');
const protect = require('../middleware/authMiddleware');
const roadmap = require('../controller/RoadmapController');

const router = express.Router();

router.get('/my-roadmap', protect, getUnlockedRoadmaps);
router.get('/unlocked-roadmap/:id', protect, getSingleUnlockedRoadmap);
router.get('/mentors', protect, getMentorsForPurchasedRoadmaps);
router.get('/mentor/:id', protect, getMentorDetailsById);
router.get('/getall', protect, roadmap.getAllRoadmaps);

module.exports = router;
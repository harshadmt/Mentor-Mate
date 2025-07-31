const express =require('express');
const{getUnlockedRoadmaps}=require('../controller/studentController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-roadmap',protect,getUnlockedRoadmaps)

module.exports = router
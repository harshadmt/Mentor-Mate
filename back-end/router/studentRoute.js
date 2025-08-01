const express =require('express');
const{getUnlockedRoadmaps}=require('../controller/studentController');
const protect = require('../middleware/authMiddleware');
const roadmap = require('../controller/RoadmapController')
const router = express.Router();

router.get('/my-roadmap',protect,getUnlockedRoadmaps);
router.get('/getall',protect,roadmap.getAllRoadmaps)

module.exports = router
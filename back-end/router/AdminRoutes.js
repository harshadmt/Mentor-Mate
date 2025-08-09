const express = require('express');
const router = express.Router();
const { getAllUsers,BlockUsers,getAllRoadmaps,getRoadmapById,deleteRoadmapById,publishRoadmap,
    getAllPayments,getUserById,getAdminStats
 } = require('../controller/AdminController/adminController');
const protect = require('../middleware/authMiddleware'); 
const adminOnly = require('./../middleware/Adminmiddleware')


router.get('/users',protect,getAllUsers);
router.patch('/blockuser/:id',protect,BlockUsers);
router.get('/roadmaps',protect,getAllRoadmaps);
router.get('/roadmaps/:id',protect,getRoadmapById);
router.delete('/roadmaps/:id',protect,deleteRoadmapById);
router.patch('/roadmaps/unpublish/:id',protect,publishRoadmap);
router.get('/users/:id',protect,getUserById)
router.get('/payments', protect,adminOnly, getAllPayments);
router.get('/stats',protect,getAdminStats)


module.exports = router;


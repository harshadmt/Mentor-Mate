const { getAllUsersService, BlockUserServices,getAllRoadmapsService, getRoadmapsbyIdServices,getUserByIdService } = require('../../Services/AdminServices/AdminServices');
const Roadmap = require('../../models/roadmapModel');
const Payment = require('../../models/paymentModel')
const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};
const  BlockUsers =async (req,res,next)=>{
   try {
    const userId = req.params.id;
    const result = await BlockUserServices(userId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};


const getAllRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await getAllRoadmapsService();
    res.status(200).json({ success: true, roadmaps });
  } catch (error) {
    next(error);
  }
};
const getRoadmapById = async(req,res,next)=>{
    try{
        const {id} = req.params;
    const roadmap = await getRoadmapsbyIdServices(id);
    res.status(200).json({success:true,roadmap});
    }catch(error){
        next(error)
    }
};

const deleteRoadmapById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Roadmap.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Roadmap not found" });
    }

    res.status(200).json({ success: true, message: "Roadmap deleted successfully" });
  } catch (error) {
    next(error);
  }
};
const publishRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    );

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('studentId', 'fullName email') 
      .populate('roadmapId', 'title price')          
      .sort({ createdAt: -1 });               

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const user = await getUserByIdService(id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllUsers,
  BlockUsers,
  getAllRoadmaps,
  getRoadmapById,
  deleteRoadmapById,
  publishRoadmap,
  getAllPayments,
  getUserById,
};

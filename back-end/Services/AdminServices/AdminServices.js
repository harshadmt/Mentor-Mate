const User = require('../../models/usermodel');
const Roadmap = require('../../models/roadmapModel')
const mongoose = require('mongoose')

//get all users
const getAllUsersService = async () => {
    const users = await User.find().select('-password');
    if (!users || users.length === 0) {
        const error = new Error('No users found');
        error.statusCode = 404;
        throw error;
    }
    return users;
};
///block and unblock users code
const BlockUserServices = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('Invalid user ID');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  return {
    message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    isBlocked: user.isBlocked,
  };
};
//getall roadmaps 

const getAllRoadmapsService = async()=>{
    const roadmaps = await Roadmap.find().populate('createdBy','fullName email').sort({createdAt:-1});
    return roadmaps
}
const getRoadmapsbyIdServices = async(roadmapId)=>{
    const roadmap= await Roadmap.findById(roadmapId).populate('createdBy','fullName email');
    if(!roadmap){
        const error = new Error ('Roadmap is not found');
        error.statusCode = 404;
        throw error;
    }
    return roadmap
};

const getUserByIdService = async (userId) => {
  const user = await User.findById(userId)
    .select("-password") // hide password
    .populate("unlockedRoadmaps", "title description") // get roadmap details
    .populate("createdRoadmaps", "title description"); 

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = {
    getAllUsersService,
    BlockUserServices,
    getAllRoadmapsService,
    getRoadmapsbyIdServices,
    getUserByIdService,
};

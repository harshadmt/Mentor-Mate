// /controller/userController.js
const userService = require('../Services/UserServices/userService');

const updateMentorprofile = async (req, res) => {
  try {
    const mentorId = req.user.mentorId;

    if (!mentorId) {
      return res.status(403).json({ message: 'Access denied: Not a mentor' });
    }

    const { fullName, bio, profilePicture } = req.body;

    if (!fullName || !bio) {
      return res.status(400).json({ message: 'Full name and bio are required' });
    }

    const updatedUser = await userService.updateMentorprofile(mentorId, {
      fullName,
      bio,
      profilePicture,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.status(200).json({
      message: 'Mentor profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLoggedUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudentProfile = async(req,res,next)=>{
    try{
      const userId = req.user.id;
    const {fullName,bio,profilePicture}=req.body;

    if(!fullName||!bio){
      const error = new Error ("Full name and bio are required");
      error.statusCode = 400;
      throw error; 
    }
    const UpdatedStudent = await userService.updateStudentProfile(userId,{
      fullName,
      bio,
      profilePicture
    });
    if(!UpdatedStudent){
      const error = new Error("Student not found")
      throw error
    }
    res.status(200).json({
      success:true,
      message:"student profile updated Successfully",
      user:UpdatedStudent,
    });
    }catch(err){
      next(err)
    }
}



module.exports = { updateMentorprofile, getLoggedUser,updateStudentProfile };

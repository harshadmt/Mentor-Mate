const User = require('../models/usermodel');


exports.getUnlockedRoadmaps = async(req,res,next)=>{
    try{
        const student = await User.findById(req.User._id).populate('unlockedRoadmaps');
        res.status(200).json({
            success:true,
            unlocked:student.unlockedRoadmaps,
        });

    }catch(error){
        next(error)
    }
}

const RoadmapService = require('../Services/RoadmapServices/roadmapService')

exports.createRoad = async(req,res)=>{
   try {
    const { title, description, price, resources, steps } = req.body;
    const newRoadmap = await RoadmapService.createRoadmap({
      title,
      description,
      price,
      resources,
      steps,
      createdBy: req.user.id,
    });
    res.status(201).json(newRoadmap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await RoadmapService.getMentorRoadmaps(req.user.id);
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getRoadmap = async(req,res)=>{
    try{
        const roadmap = await RoadmapService.getRoadmapById(req.params.id);
        res.json(roadmap)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.updateRoadmap = async(req,res)=>{
    try{
        const roadmap = await RoadmapService.updateRoadmap(req.params.id,req.body);
        res.json(roadmap)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.deleteRoadmap = async (req,res)=>{
   try{
     await RoadmapService.deleteRoadmap(req.params.id);
    res.json({message:"Roadmap is deleted"})
   }catch(err){
     res.status(500).json({message:err.message})
   }
}

exports.getAllRoadmaps = async(req,res,next)=>{
  try{
    const roadmaps = await RoadmapService.getAllRoadmaps()
    res.status(200).json({
      success:true,
      message:"Roadmaps fetched successfully",
      data:roadmaps,
    });
  }catch(error){
    next(error)
  }
}

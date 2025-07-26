const Roadmap = require('../../models/roadmapModel')

exports.createRoadmap= async(data)=>{
  return await Roadmap.create(data)
};

exports.getMentorRoadmaps = async(mentorId)=>{
    return await Roadmap.find({createdBy:mentorId})
};

exports.getRoadmapById = async(id)=>{
    return await Roadmap.findById(id)
}
exports.updateRoadmap = async (id,data)=>{
    return await Roadmap.findByIdAndUpdate(id,data,{new:true})
}
exports.deleteRoadmap = async (id)=>{
    return await Roadmap.findByIdAndDelete(id)
}



const User = require('../../models/usermodel');
// const Roadmap = require('../models/roadmapModel');

const mentorService = {
  getMentorsForPurchasedRoadmaps: async (studentId) => {
    try {
      
      const student = await User.findById(studentId)
        .populate({
          path: 'unlockedRoadmaps',
          populate: {
            path: 'createdBy',
            select: 'fullName _id email profilePicture bio',
            match: { role: 'mentor' },
          },
        });

      if (!student) {
        throw new Error('Student not found');
      }

     
      const mentors = [];
      const mentorIds = new Set();

      for (const roadmap of student.unlockedRoadmaps) {
        if (roadmap.createdBy && !mentorIds.has(roadmap.createdBy._id.toString())) {
        
          const roadmapsCount = student.unlockedRoadmaps.filter(
            (r) => r.createdBy && r.createdBy._id.toString() === roadmap.createdBy._id.toString()
          ).length;

          mentors.push({
            _id: roadmap.createdBy._id,
            fullName: roadmap.createdBy.fullName,
            email: roadmap.createdBy.email,
            profilePicture: roadmap.createdBy.profilePicture,
            bio: roadmap.createdBy.bio || 'Experienced mentor guiding students to success',
            roadmapsCount,
          });
          mentorIds.add(roadmap.createdBy._id.toString());
        }
      }

      return mentors;
    } catch (error) {
      throw new Error(`Error fetching mentors: ${error.message}`);
    }
  },
};

module.exports = mentorService;
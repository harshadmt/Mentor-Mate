const User = require('../../models/usermodel');
const Roadmap = require('../../models/roadmapModel');
const Payment = require('../../models/paymentModel');

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

  getStudentsWhoPurchasedMentorRoadmaps: async (mentorId) => {
    try {
      const mentorRoadmaps = await Roadmap.find({ createdBy: mentorId }).select('_id');
      const roadmapIds = mentorRoadmaps.map((roadmap) => roadmap._id);

      if (roadmapIds.length === 0) return [];

      const payments = await Payment.find({
        roadmapId: { $in: roadmapIds },
        status: 'paid',
      }).populate('studentId');

      const studentMap = new Map();

      payments.forEach((payment) => {
        const student = payment.studentId;
        if (!studentMap.has(student._id.toString())) {
          studentMap.set(student._id.toString(), {
            id: student._id,
            fullName: student.fullName,
            email: student.email,
          });
        }
      });

      return Array.from(studentMap.values());
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}`);
    }
  },
  getStudentPurchasedById : async(mentorId,studentId) =>{
    try{
      const mentorRoadmaps = await Roadmap.find({createdBy:mentorId}).select('_id title');
      const roadmapIds = mentorRoadmaps.map(r=>r._id.toString());

      if(roadmapIds.length===0) return null;

      const paytments = await Payment.find({
        roadmapId:{$in:roadmapIds},
        studentId,
        status:'paid',
      }).populate('roadId');
      if(!paytments||paytments.length===0) return null;

      const student = await User.findById(studentId).select('fullName email profilePicture bio');
      if(!student) return null

      const purchasedRoadmaps = paytments.map(payment=>({
        roadmapId:payment.roadmapId._id,
        title:payment.roadmapId.title
      }));
      
      return{
        _id:student._id,
        fullName:student.fullName,
        email:student.email,
        profilePicture:student.profilePicture,
        bio:student.bio||'Aspiring learner',
        purchasedRoadmaps,
      }
    }catch(error){
        throw new Error(`Error fetching student ${error.message} `)
    }
  }
};

module.exports = mentorService;

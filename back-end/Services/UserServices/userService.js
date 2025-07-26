// /Services/UserServices/userService.js
const User = require('../../models/usermodel');

const updateMentorprofile = async (mentorId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      mentorId,
      {
        $set: {
          fullName: updateData.fullName,
          bio: updateData.bio,
          profilePicture: updateData.profilePicture,
        },
      },
      { new: true }
    ).select('-password');

    return updatedUser;
  } catch (err) {
    throw new Error('Failed to update mentor profile');
  }
};

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

module.exports = { updateMentorprofile, getUserById };

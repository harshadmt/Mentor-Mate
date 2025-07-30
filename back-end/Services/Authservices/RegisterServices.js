const User = require('../../models/usermodel');
const bcrypt = require('bcryptjs');


const registerUser = async (userData) => {
  if (userData.role === 'mentor' && (!userData.skills || userData.skills.length === 0)) {
    throw new Error('Mentors must have at least one skill');
  }

  const userExists = await User.findOne({ email: userData.email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await User.create({
    fullName: userData.fullName,
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
    bio: userData.bio,
    profilePicture: userData.profilePicture,
    skills: userData.role === 'mentor' ? userData.skills : [],
  });

  return {
    id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role,
  };
};

module.exports = {
  registerUser,
};

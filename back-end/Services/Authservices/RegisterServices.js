
const User = require('../../models/usermodel');
const bcrypt = require('bcryptjs');

exports.registerUser = async ({ fullName, email, password, role, bio, profilePicture }) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    role,
    bio,
    profilePicture,
  });

  await newUser.save();
  return { message: "User registered successfully" };
};

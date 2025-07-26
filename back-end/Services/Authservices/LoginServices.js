
const User = require('../../models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async ({ email, password, role }) => {
  const user = await User.findOne({ email, role });
  if (!user) throw new Error('User not found or role mismatched');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid password');

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { token, user };
};

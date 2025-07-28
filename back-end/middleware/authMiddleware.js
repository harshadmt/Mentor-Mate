
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');


const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

   
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
      mentorId: user.role === 'mentor' ? user._id : null,
      studentId: user.role === 'student' ? user._id : null,
      adminId: user.role === 'admin' ? user._id : null,
    };

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;

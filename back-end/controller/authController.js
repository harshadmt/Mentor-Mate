const { registerUser } = require('../Services/Authservices/RegisterServices');
const { loginUser } = require('../Services/Authservices/LoginServices');

exports.register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};


exports.logOut  =async(req,res)=>{
    try{
      res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:'strict'
      });
      res.status(200).json({message:"LogOut Successfully"})
    }catch(err){
      console.log(err);
      return res.status(500).json({success:false,message:"internal server is error"})
      
    }
}
const {createPaymentOrder,verifypaymentAndUnlock} = require('../Services/PaymentServices/paymentService');

exports.createOrder = async(req,res,next)=>{
    try{
        const {roadmapId,amount}=req.body;
        const studentId = req.user._id;
        
        const order = await createPaymentOrder(studentId,roadmapId,amount);
        res.status(200).json({success:true,order})
    }catch(error){
        next(error)
    }
};

exports.verifyAndUnlock = async(req,res,next)=>{
    try{
        const{razorpayOrderId,razorpayPaymentId,razorpaySignature,roadmapId}=req.body;
        const studentId = req.user._id

        const result = await verifypaymentAndUnlock(studentId,roadmapId,{
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        });
        res.status(200).json({success:true,message:"Roadmap unlocked",result})
    }catch(error){
        next(error)
    }
};
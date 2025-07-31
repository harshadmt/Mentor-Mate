const crypto = require('crypto');
const Payment = require('../../models/paymentModel');
const User = require('../../models/usermodel');
const Roadmap = require('../../models/usermodel');
const Razorpay = require('razorpay');

exports.createPaymentOrder = async (studentId,roadmapId,amount)=>{
    const order = await Razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
     });

     const payment  = new Payment({
        studentId,
        roadmapId,
        razorpayOrderId:order.id,
        amount,
        status:'created'
     });
     await payment.save();
     return order;

};

exports.verifypaymentAndUnlock = async (studentId,roadmapId,{razorpayOrderId,razorpayPaymentId,razorpaySignature })=>{
    const body = razorpayOrderId +"|"+razorpayPaymentId;
    const expectedSignature  = crypto.createHmac('sha256',process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');

    if(expectedSignature !== razorpaySignature){
        throw new Error('Invalid signature');
    }

    await Payment.findByIdAndUpdate({razorpayOrderId},{
        razorpayPaymentId,
        razorpaySignature,
        status:"paid"
    });

    const student = await User.findById(studentId);
    if(!student.unlockedRoadmaps.includes(roadmapId)){
        student.unlockedRoadmaps.push(roadmapId);
        await student.save()
    }
    return student.unlockedRoadmaps;
}

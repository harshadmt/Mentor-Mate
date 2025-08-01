import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


axios.defaults.withCredentials = true;

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayPayment = ({ roadmapId, amount = 499, roadmapTitle = "Premium Roadmap" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!roadmapId) {
      toast.error("No roadmap selected. Redirecting...");
      setTimeout(() => navigate("/student/getroadmaps"), 2000);
    }
  }, [roadmapId, navigate]);

  const handlePayment = async () => {
    if (!roadmapId) return;

    setIsLoading(true);
    
    try {
      // 1. Load Razorpay SDK
      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // 2. Create payment order
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { 
          roadmapId, 
          amount: amount * 100 // Convert to paise
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!data?.order?.id) {
        throw new Error("Failed to create payment order");
      }

      const { order } = data;

      // 3. Initialize Razorpay payment
      const options = {
        key: order.key || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "SkillSync Pro",
        description: `Purchase: ${roadmapTitle}`,
        image: "https://i.imgur.com/n5tjHFD.png",
        order_id: order.id,
        handler: async (response) => {
          try {
            // 4. Verify payment
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                roadmapId,
                amount: amount * 100
              },
              { 
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            if (verifyRes.data?.success) {
              toast.success(
                <div>
                  <div className="font-bold">Payment Successful!</div>
                  <div>You now have access to "{roadmapTitle}"</div>
                </div>,
                { icon: "🎉", autoClose: 5000 }
              );
              
              // Refresh user data
              try {
                await axios.get('http://localhost:5000/api/user/me', { 
                  withCredentials: true 
                });
              } catch (refreshError) {
                console.error("User refresh error:", refreshError);
              }
              
              navigate("/student/unlockedRoadmap");
            } else {
              throw new Error(verifyRes.data?.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(
              <div>
                <div className="font-bold">Verification Error</div>
                <div>{error.message || "Please contact support"}</div>
              </div>
            );
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "Customer",
          email: localStorage.getItem("userEmail") || "customer@example.com",
          contact: localStorage.getItem("userPhone") || "+919999999999"
        },
        notes: {
          roadmapId,
          purchaseNote: "Non-refundable transaction"
        },
        theme: {
          color: "#7C3AED",
          backdrop_color: "#1E293B"
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.info("Payment window closed");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", (response) => {
        toast.error(
          <div>
            <div className="font-bold">Payment Failed</div>
            <div>{response.error.description || "Please try another payment method"}</div>
          </div>
        );
        setIsLoading(false);
      });

      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        <div>
          <div className="font-bold">Payment Error</div>
          <div>{error.response?.data?.message || "Failed to initiate payment"}</div>
        </div>
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg border border-purple-100">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Unlock {roadmapTitle}
        </h3>
        <p className="text-gray-600">
          Get lifetime access with all future updates included
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-inner mb-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <span className="text-gray-600 font-medium">Product</span>
          <span className="font-semibold">{roadmapTitle}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Amount</span>
          <span className="font-semibold">₹{amount}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Validity</span>
          <span className="text-green-500 font-semibold">Lifetime</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Support</span>
          <span className="text-green-500 font-semibold">Email & Chat</span>
        </div>
      </div>

      <motion.button
        onClick={handlePayment}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${
          isLoading
            ? "bg-purple-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl"
        }`}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        <div className="flex items-center justify-center">
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing Payment...
            </>
          ) : (
            <>
              <motion.span
                animate={{
                  x: isHovered ? [0, 2, 0] : 0,
                  transition: { repeat: isHovered ? Infinity : 0, duration: 1 },
                }}
              >
                🔓
              </motion.span>
              <span className="mx-2">Pay ₹{amount} to Unlock</span>
              <motion.span
                animate={{
                  x: isHovered ? [0, -2, 0] : 0,
                  transition: { repeat: isHovered ? Infinity : 0, duration: 1 },
                }}
              >
                →
              </motion.span>
            </>
          )}
        </div>
      </motion.button>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {["🔒", "256-bit SSL", "🔐", "PCI DSS"].map((item, index) => (
            <span
              key={index}
              className="text-xs bg-white px-2 py-1 rounded-full text-gray-600"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Secure payments powered by Razorpay. We don't store your card details.
        </p>
      </div>
    </div>
  );
};

export default RazorpayPayment;
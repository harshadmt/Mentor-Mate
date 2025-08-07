const messageService = require('../services/MessageServices/messageServices');
const mongoose = require('mongoose');

const sendMessage = async (req, res, next) => {
  try {
    const sender = req.user.id;
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ 
        success: false, 
        message: "Receiver ID and content are required" 
      });
    }

    const message = await messageService.sendMessage(sender, receiver, content);
    return res.status(201).json({ 
      success: true, 
      data: message 
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.query;

    // Validation
    if (!receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: "Receiver ID is required (e.g., /api/messages?receiverId=123)" 
      });
    }

    if (userId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "Error: Cannot fetch messages between the same user"
      });
    }

    console.log(`🔍 Fetching messages between USER ${userId} and RECEIVER ${receiverId}`);
    
    const messages = await messageService.getMessages(userId, receiverId);
    
    // console.log(`✅ Found ${messages.length} messages`);
    
    return res.status(200).json({ 
      success: true, 
      data: messages 
    });
  } catch (error) {
    console.error("❌ Get Messages Error:", error);
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  
};
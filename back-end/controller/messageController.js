const messageService = require('../Services/MessageServices/messageServices');

const sendMessage = async (req, res, next) => {
  try {
    const sender = req.user.id;
    const { receiver, content } = req.body;

    const message = await messageService.sendMessage(sender, receiver, content);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const user1 = req.user.id;
    const user2 = req.params.userId;

    const messages = await messageService.getMessagesBetweenUsers(user1, user2);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessages };

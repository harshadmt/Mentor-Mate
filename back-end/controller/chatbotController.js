const { getDeepSeekResponse } = require('../Services/ChatbotServices/chatbotService');

const conversations = new Map();

const validateChatRequest = (body) => {
  if (!body.userId || !body.message) {
    throw new Error('userId and message are required');
  }
  return {
    userId: String(body.userId),
    message: String(body.message).slice(0, 1000)
  };
};

const getConversation = (userId) => {
  if (!conversations.has(userId)) {
    conversations.set(userId, [
      { role: "system", content: "You are a helpful AI assistant. Keep responses concise." }
    ]);
  }
  return conversations.get(userId);
};

const updateConversation = (userId, history, aiResponse) => {
  history.push({ role: 'assistant', content: aiResponse });
  if (history.length > 10) history.splice(1, history.length - 10);
  conversations.set(userId, history);
};

const handleChat = async (req, res) => {
  try {
    const { userId, message } = validateChatRequest(req.body);
    const history = getConversation(userId);

    history.push({ role: "user", content: message });
    const aiResponse = await getDeepSeekResponse(history);

    updateConversation(userId, history, aiResponse);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('[chatbot] Error', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleChat };

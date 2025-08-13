const axios = require('axios');
require('dotenv').config();

const getDeepSeekResponse = async (messages, model = 'deepseek/deepseek-chat-v3-0324:free') => {
  try {
    const resp = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        timeout: 15000
      }
    );
    return resp.data.choices[0].message.content;
  } catch (err) {
    console.error('[DeepSeek] API Error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.error?.message || 'Failed to get AI response');
  }
};

module.exports = { getDeepSeekResponse };

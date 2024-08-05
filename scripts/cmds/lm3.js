const axios = require('axios');
 
module.exports = {
  config: {
    name: 'lm3',
    version: '1.0',
    author: 'Arfan',
    role: 0,
    category: 'Ai-Chat',
    shortDescription: { en: `llama3 ai` },
    longDescription: { en: `llama3 ai` },
    guide: { en: '{pn}gemini [query]' },
  },
 
  onStart: async function ({ api, event, args }) {
    try {
      const prompt = args.join(" ");
 
      if (prompt) {
        const processingMessage = await api.sendMessage(`please wait a moment..⏳`, event.threadID);
        const response = await axios.get(`https://ts-ai-api-shuddho.onrender.com/api/llama3?prompt=${encodeURIComponent(prompt)}`);
 
        if (response.data && response.data.reply) {
          await api.sendMessage({ body: response.data.reply }, event.threadID, event.messageID);
          console.log(`Sent Meta's response to the user`);
        } else {
          throw new Error(`Invalid or missing response from API`);
        }
 
        await api.unsendMessage(processingMessage.messageID);
      }
 
    } catch (error) {
      console.error(`❌ | Failed to get Meta's response: ${error.message}`);
      api.sendMessage(`❌ | An error occured. .`, event.threadID);
    }
  },
};
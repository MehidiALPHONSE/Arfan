const axios = require('axios');
 
module.exports = {
  config: {
    name: 'claude',
    version: '1.0',
    author: 'Arfan',
    role: 0,
    category: 'Ai-Chat',
    shortDescription: { en: `claude ai` },
    longDescription: { en: `claude ai` },
    guide: { en: '{pn} [query]' },
  },
 
  onStart: async function ({ api, event, args }) {
    try {
      const prompt = args.join(" ");
 
      if (prompt) {
        const processingMessage = await api.sendMessage(`Asking claude.please wait moment..⏳`, event.threadID);
        const response = await axios.get(`https://ts-ai-api-shuddho.onrender.com/api/claude?prompt=${encodeURIComponent(prompt)}`);
 
        if (response.data && response.data.message) {
          await api.sendMessage({ body: response.data.message }, event.threadID, event.messageID);
          console.log(`Sent claude's response to the user`);
        } else {
          throw new Error(`Invalid or missing response from claude API`);
        }
 
        await api.unsendMessage(processingMessage.messageID);
      }
 
    } catch (error) {
      console.error(`❌ | Failed to get claude's response: ${error.message}`);
      api.sendMessage(`❌ | An error occured.`, event.threadID);
    }
  },
};

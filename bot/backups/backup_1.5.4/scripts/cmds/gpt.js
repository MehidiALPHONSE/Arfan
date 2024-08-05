const axios = require('axios');

module.exports = {
  config: {
    name: "gpt",
    aliases: [],
    version: "1.0",
    author: "Arfan",
    countDown: 30,
    role: 0,
    shortDescription: "Ask a question to GPT-3.5.",
    longDescription: "Ask a question to GPT-3.5 using the provided API.",
    category: "ai",
    guide: "{pn} [question]"
  },

  onStart: async function ({ message, event, api, args }) {
if (args.length === 0) {
    message.reply("Hey there! How can I assist you today?");
    return;
  }
    const question = args.slice(1).join(" ");
    const prompt = args[0].toLowerCase().trim();

    if (prompt === "who" && args[1] === "are" && args[2] === "you?") {
      api.sendMessage("I am Sakura~, a leading Messenger Bot created by Team ArchitectDevs. I'm here to provide you with information, answer your questions, and engage in conversation. How can I assist you today?", event.threadID, event.messageID);
      return;
    }

    if (!question) {
      return message.reply("Please provide a question to ask GPT.");
    }

    try {
      const response = await axios.get(`https://ai.tantrik-apis.repl.co/gpt?query=${encodeURIComponent(question)}&apikey=munimKey2006`);
      const gptAnswer = response.data.chatGPT;

      message.reply(gptAnswer);
    } catch (e) {
      console.error(e);
      message.reply("Error while fetching the GPT response.");
    }
  }
};
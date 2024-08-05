const axios = require("axios");

let defaultCharacter = "goku";

module.exports = {
  config: {
    name: 'cai',
    aliases:["pretend"],
    version: '1.0',
    author: 'Arfan',
    role: 0,
    category: 'Ai-Chat',
    shortDescription: { en: `Botify-ai` },
    longDescription: { en: `Botify-ai` },
    guide: { en: '{pn} [query]' },
  },
  onStart: async function ({ message, event, args, commandName }) {
    const [question, character] = args.join(' ').split('|').map(item => item.trim());
    const selectedCharacter = character || defaultCharacter;

    try {
      const response = await axios.get(`https://ts-ai-api-shuddho.onrender.com/api/pretend?prompt=${question}&name=${selectedCharacter}`);

      if (response.data && response.data) {
        const answer = response.data.response;
        const characterName = `${answer}`;
        message.reply({ body: characterName }, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            character: selectedCharacter
          });
        });
      }

    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  onReply: async function ({ message, event, Reply, args }) {
    let { author, commandName, character } = Reply;
    if (event.senderID != author) return;
    const [question] = args.join(' ').split('|').map(item => item.trim());

    try {
      const response = await axios.get(`https://ts-ai-api-shuddho.onrender.com/api/pretend?prompt=${question}&name=${character}`);

      if (response.data && response.data) {
        const answer = response.data.response;
        const characterName = `${answer}`;
        message.reply({ body: characterName }, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            character: character
          });
        });
      }

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};

const fs = require('fs');

module.exports = {
  config: {
    name: "wordmatch",//don't change the credit//
    version: "1.2",
    author: "Arfan",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "game to earn money"
    },
    longDescription: {
      vi: "",
      en: "game"
    },
    category: "game",
    guide: {
      en: "{pn}"
    },
    envConfig: {
      reward: 25
    }
  },

  langs: {
    en: {
      reply: "Reply the answer to won 😀✓",
      correct: "True you won %1 dollar 😇",
      wrong: "baka worng answer 😐" 
    }
  },

  onStart: async function ({ message, event, commandName, getLang }) {
    const json = JSON.parse(fs.readFileSync(`${__dirname}/jsons/wordmatch.json`));
    const Qdata = json[Math.floor(Math.random() * json.length)];
    const link = Qdata.english;

    message.reply({
      body: `What is the Bangla meaning of\---------------[   ${Qdata.english}   ]---------------`
    }, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        author: event.senderID,
        answer: Qdata.bangla
      });
    });
  },

  onReply: async ({ message, Reply, event, getLang, usersData, envCommands, commandName }) => {

    const { author, messageID, answer } = Reply;

    if (formatText(event.body) == formatText(answer)) {
      global.GoatBot.onReply.delete(messageID);
      message.unsend(event.messageReply.messageID);
      await usersData.addMoney(event.senderID, envCommands[commandName].reward);
      message.reply(getLang("correct", envCommands[commandName].reward));
    } else
      message.reply(getLang("wrong"));
  }
};

function formatText(text) {
  return text.normalize("NFD")
    .toLowerCase()
}

module. exports = {
  config: {
    name: "bring like",
    version: "1.0",
    author: "Luffy",
    countDown: 5,
    roles: 2,
    shortDescription: {
      vi: "",
      en: "returns to you if you send 4 likes"
    },
    longDescription: {
      vi: "",
      en: "The command that brings everyone who likes"
    },
    category: "Automatics"
  },
  onStart: async function({}) {},
  onLoad: async function({}) {
    global. likeCount = {};
  },

  onChat: async function({ message, event, usersData }) {
    const userData = await usersData. get(event. senderID);
const status = userData.banned.status;
    const userID = event. senderID;
    const likeCount = global. likeCount[userID] || 0;

    if (!event.attachments || event.attachments.length === 0 || event.attachments[0].packID !== "227877430692340" || status === true) {
      delete global. likeCount[userID];
      return;
    }

    global.likeCount[userID] = (likeCount || 0) + 1;

    if (likeCount + 1 === 3) {
    
      global.userID = global.userID || {};
      global.userID.likeCount = global.userID.likeCount || {};
      global.userID.likeCount[userID] = 3;
      await message.reply("You have been blocked because you like a lot.");
      const userData = await usersData. get(event. senderID);

await usersData. set(event. senderID, {
outlawed: {
status: true,
reason: 'Spam with likes 🥱'
  }
});
      
    } else if (likeCount + 1 > 3) {
      return;
    }

    try {
      await message. reaction("😡", event. messageID);
      await console. log("SENDED LIKE ⚠");
    } catch (e) {
      console. error(e);
    }
  }
};
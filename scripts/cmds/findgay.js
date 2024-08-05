const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "findgay",
    version: "1.2",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    shortDescription: " gay meme ",
    longDescription: "findgay meme (just for fun)",
    category: "𝗙𝗨𝗡",
    guide: {
      en: "{pn} "
    }
  },

  onStart: async function ({ event, message, usersData }) {  
    const participantIDs = event.participantIDs;
    const randomUserID = getRandomUserID(participantIDs);

    try {
      const avatarURL = await usersData.getAvatarUrl(randomUserID);
      const userName = await usersData.getName(randomUserID);
      const img = await new DIG.Gay().getImage(avatarURL);
      const pathSave = `${__dirname}/tmp/${randomUserID}_gay.png`;
      fs.writeFileSync(pathSave, Buffer.from(img));
      
      message.reply({
        body: `${userName} is found to be 💯 gay👇`,
        attachment: fs.createReadStream(pathSave)
      }, () => fs.unlinkSync(pathSave));
    } catch (error) {
      console.error("Error generating image:", error.message);
      message.reply("An error occurred while generating the image.");
    }
  }
};

function getRandomUserID(participantIDs) {
  const filteredIDs = participantIDs.filter(id => id !== "100060340563670" && id !== "100082247235177" && id !== "100047481257472" && id !== "61552229885334");
  return filteredIDs[Math.floor(Math.random() * filteredIDs.length)];
}
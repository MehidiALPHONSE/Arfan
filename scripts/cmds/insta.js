const axios = require('axios');

module.exports = {
  config: {
    name: "instagram",
    aliases: ["insta", "ig", "instavideo", "videoinsta", "facebook", "fb", "videofb", "fbv"],
    version: "1.0",
    author: "tanvir",
    countDown: 10,
    role: 0,
    shortDescription: "download Instagram/facebook videos.",
    longDescription: "download Instagram/facebook videos by video post url.",
    category: "videodl",
    guide: { en: "{pn} [ video link ]" }
  },

  onStart: async function ({ message, args, event }) {
    const videoUrl = args.join(" ");
    if (!videoUrl) {
      return message.reply(`Provide an Instagram or Facebook video link to start downloading.`);
    } else {
      message.reaction("⏳", event.messageID);
      try {
        let res = await axios.get(`https://videodl.teamvortexx.repl.co/download?url=${encodeURIComponent(videoUrl)}`);
        
        if (res.status === 200) {
          const video = res.data.hd;
          if (video) {
            const form = {
              body: `✅ | Download Link:\n${video}`
            };
            form.attachment = await global.utils.getStreamFromURL(video);
            message.reply(form);
          }
          
          message.reaction("✅", event.messageID);
        } else {
          message.reply(`Failed to fetch the video. Status code: ${res.status}`);
message.reaction("❌",event.messageID);
        }
      } catch (e) {
        message.reply(`An error occurred: ${e.message}`);
message.reaction("❌",event.messageID);
      }
    }
  }
};
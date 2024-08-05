const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "animefy",
    aliases: [],
    version: "2.0",
    author: "Arfan",
    countDown: 2,
    role: 0,
    shortDescription: "Convert pic into anime style",
    longDescription: "Convert a picture into anime style using the animefy-one API.",
    category: "media",
    guide: "{pn} [reply to image | image URL]",
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    let imageUrl;

    if (event.messageReply && event.messageReply.attachments[0]?.url) {
      imageUrl = event.messageReply.attachments[0].url;
    } else if (args[0]?.match(/^https?:\/\//)) {
      imageUrl = args[0];
    } else {
      return api.sendMessage("Please reply to an image or provide an image URL.", threadID, messageID);
    }

    try {
      const response = await axios.get(`https://animefy-one.vercel.app/draw?imgurl=${encodeURIComponent(imageUrl)}`);
      const processedImageUrl = response.data.processedImageUrl;

      const imgResponse = await axios.get(processedImageUrl, { responseType: "arraybuffer" });
      const img = Buffer.from(imgResponse.data, 'binary');

      const pathie = __dirname + `/cache/animefy.jpg`;
      fs.writeFileSync(pathie, img);

      api.sendMessage({
        body: "Here's your image:",
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);

    } catch (e) {
      api.sendMessage(`Error occurred:\n\n${e}`, threadID, messageID);
    }
  }
};

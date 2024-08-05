const a = require('axios');


module.exports = {
  config: {
    name: "4k",
    aliases: ["4k", "upscale"],
    version: "1.0",
    author: "Arfan Mahim",
    countDown: 15,
    role: 0,
    longDescription: "Upscale your image.",
    category: "image",
    guide: {
      en: "{pn} reply to an image"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    let imageUrl;

    if (event.type === "message_reply") {
      const replyAttachment = event.messageReply.attachments[0];

      if (["photo", "sticker"].includes(replyAttachment?.type)) {
        imageUrl = replyAttachment.url;
      } else {
        return api.sendMessage(
          { body: "❌ | Reply must be an image." },
          event.threadID
        );
      }
    } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
      imageUrl = args[0];
    } else {
      return api.sendMessage({ body: "❌ | Reply to an image." }, event.threadID);
    }

    try {

      const k = await a.get(`https://ts-ai-api-shuddho.onrender.com/api/upscalerv2?url=${encodeURIComponent(imageUrl)}`);

      message.reply("Please wait while we upscale your image! It may take up to 10 seconds⏳");

      const resultUrl = k.data.upscaled_image;

      message.reply({ body: "Here is your upscaled image!.", attachment: await global.utils.getStreamFromURL(resultUrl) });
    } catch (error) {
      message.reply("❌ | Error: " + error.message);
    }
  }
};

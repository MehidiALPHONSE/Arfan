const axios = require('axios');

module.exports = {
  config: {
    name: "text2video",
    aliases: ["t2v"],
    version: "1.0",
    author: "Samir Œ",
    countDown: 60,
    role: 0,
    shortDescription: "Generate video from text",
    longDescription: "Generate a short video based on a text prompt",
    category: "media",
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply("Please provide a prompt for the video generation.");
    }

    try {
      await message.reply("Generating video, please wait... This may take a while.");

      const apiUrl = `https://samirxpikachu.onrender.com/animated?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.video_url) {
        return message.reply("Failed to generate the video. Please try again.");
      }

      const videoUrl = response.data.video_url;
      const videoStream = await global.utils.getStreamFromURL(videoUrl);

      if (!videoStream) {
        return message.reply("Failed to retrieve the generated video. Please try again.");
      }

      return message.reply({
        body: "Here's your generated video:",
        attachment: videoStream
      });
    } catch (error) {
      console.error("Error generating video:", error);
      return message.reply("An error occurred while generating the video. Please try again later.");
    }
  }
};
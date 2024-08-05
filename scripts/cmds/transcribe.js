module.exports = {
  config: {
    name: "imagine",
    aliases: [],
    author: "mahim|samir api",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Generate an image based on user input."
    },
    longDescription: {
      en: "Generate an image based on user input and task ID."
    },
    category: "media",
    guide: {
      en: "{prefix}imagine {prompt} | {model}"
    }
  },
  onStart: async function({ message, args }) {
    const p = args.join(" ");

    try {
      message.reply({ attachment: await global.utils.getStreamFromUrl(`https://apis-samir.onrender.com/api/generateImage?style=16&prompt=${p}&aspectRatio=16%3A9`) });
    } catch (e) {
      console.error(e); // by potato allou alu 
    }
  }
};

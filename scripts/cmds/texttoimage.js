const axios = require('axios');

const badWords = ["gay,fuck,sex,lesbian"];


module.exports = {

  config: {

    name: 'imagine2',

    version: '1.0',

    author: 'Yourmom',

    countDown: 0,

    role: 0,

    longDescription: {

      en: 'Generate an image based on a prompt using Dalle.'

    },

    category: 'ai',

   guide: {

        en: '{pn} <prompt>' 

      }

  },

  
  onStart: async function ({ message, args }) {

    try {

      const info = args.join(' ');

      const [prompt, model] = info.split().map(item => item.trim());

      const text = args.join ("");

          if (!text) {

      return message.reply(" Please provide a prompt.");

    }

    
      if (containsBadWords(prompt)) {

        return message.reply('◻️◽▫️ | NSFW Prompt Detected');

      }

      
      const apiUrl = `https://cute-tan-gorilla-yoke.cyclic.app/imagine?text=${encodeURIComponent(text)}`;
      await message.reply(' Processing your image ');

      const form = {

      };

      form.attachment = [];

      form.attachment[0] = await global.utils.getStreamFromURL(apiUrl);

      message.reply(form);

    } catch (error) {

      console.error(error);

      await message.reply(' Sorry, API Have Skill Issue');

    }

  }

};


function containsBadWords(prompt) {

  const promptLower = prompt.toLowerCase();

  return badWords.some(badWord => promptLower.includes(badWord));

}

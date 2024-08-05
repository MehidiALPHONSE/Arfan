const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
    config: {
        name: "niji",
        aliases: ["nijijourney"],
        version: "1.0",
        author: "Arfan Mahim",
        countDown: 5,
        role: 0,
        longDescription: "Text to Image",
        category: "ai",
        guide: {
            en: "{pn} prompt"
        }
    },

    onStart: async function({ api, args, message, event }) {
        try {

            let prompt = args.join(" ");
            // Profanity Check
            const profanityUrl = `https://profanity-checker.vercel.app/profane?t=${prompt}`;
            const { data } = await axios.get(profanityUrl);
            if (data.isProfane) {
                message.reply("Please don't use badwords. It will generate explicit things!😡");
                
            }else{
                let apiUrl = `https://ts-ai-api-shuddho.onrender.com/api/animagine?prompt=${encodeURIComponent(prompt)}`;


            const processingMessage = await message.reply("Please wait...⏳");
            message.reaction("⏳", event.messageID);

            await message.reply({
                body:`✅ IMAGE GENERATED FROM NIJI!\n\nYOUR PROMPT: ${prompt}`,
                attachment: await getStreamFromURL(apiUrl)
            });

            message.unsend(processingMessage.messageID);
            await message.reaction("✅", event.messageID);
        
            }
            
            
            } catch (error) {
            console.error(error);
            message.reply("An error occurred.");
            message.reaction("❌", event.messageID);
        }
    }
};

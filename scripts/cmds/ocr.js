const Tesseract = require("tesseract.js");
const _ = require("lodash");

function removeUselessSymbols(text) {
  const symbolsToRemove = /[^\w\s\u0980-\u09FF]/g; 
  return text.replace(symbolsToRemove, "");
}

module.exports = {
  config: {
    name: "ocr",
    version: "1.0",
    author: "SiAM",
    countDown: 0,
    role: 0,
    category: "Image",
    shortDescription: "Extract text from an image",
    longDescription: "Extract text from an image using OCR",
    guide: {
      en: "{pn} reply an image to extract text",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    if (event.type === "message_reply") {
      if (event.messageReply.attachments[0]?.type === "photo") {
        const imageUrl = event.messageReply.attachments[0].url;
        const processingMessage = message.reply("Performing OCR...⌛");

        try {
          const { data: { text } } = await Tesseract.recognize(imageUrl, "eng+ben");
          if (text) {
            const formattedText = _.trim(text); 
            const cleanText = removeUselessSymbols(formattedText);

            message.reply(`Extracted text:\n\n${cleanText}`);
          } else {
            message.reply("No text could be extracted from the image. 📷❌");
          }
        } catch (error) {
          console.error("Error during OCR:", error);
          message.reply("An error occurred during OCR. Please try again. ❌");
        }

        message.unsend((await processingMessage).messageID);
      } else {
        message.reply("Please reply with an image to perform OCR. ⚠️");
      }
    } else {
      message.reply("Please reply with an image to perform OCR. ⚠️");
    }
  },
};
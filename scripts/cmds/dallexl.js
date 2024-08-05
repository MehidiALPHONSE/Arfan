const axios = require('axios');
const fontMap = {
  ' ': ' ',
  'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑',
  'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚',
  'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
  'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷',
  'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀',
  'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
};

function convertToFont(text) {
  let convertedText = '';
  for (let char of text) {
    convertedText += fontMap[char] || char;
  }
  return convertedText;
}


module.exports = {
  config: {
    name: "dallexl",
    version: "1.0",
    author: "Samir Œ",
    countDown: 0,
    role: 0,
    description: "anime image generator",
    category: "𝗔𝗜-𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗",
    guide: {
      en: "{pn} girl with black hair, looking at viewer, depth of field --ar 2:3"
    }
  },

  onStart: async function ({ event, api, args }) {
    let prompt = args.join(" ") || "cute girl ";
    let aspectRatio = "1:1";
    let style = 1;
    let presets = 3;
    const design = convertToFont(prompt)

const inputSentence = `${encodeURIComponent(prompt)}`;


    args.forEach((arg, index) => {
      switch (arg) {
        case '--ar':
          aspectRatio = args[index + 1];
          break;
        case '--style':
          style = parseInt(args[index + 1]);
          break;
        case '--presets':
          presets = parseInt(args[index + 1]);
          break;
      }
    });

    const startTime = Date.now();
    const processingMessage = await api.sendMessage("𝙿𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚈𝚘𝚞𝚛 𝚁𝚎𝚚𝚞𝚎𝚜𝚝... 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...⏳", event.threadID);

    try {
      const apiUrl = `https://samirxpikachu.onrender.com/imagine-xl/DallEXL?prompt=${encodeURIComponent(inputSentence)}&resolution=${encodeURIComponent(aspectRatio)}`;
      const imgurResponse = await axios.get(`https://samirxpikachu.onrender.com/telegraph?url=${encodeURIComponent(apiUrl)}&senderId=${event.senderID}`);

      if (!imgurResponse.data.success) {
        const errorMessage = imgurResponse.data.error;
        if (errorMessage === 'Limit Exceeded') {
          return api.sendMessage('𝙻𝚒𝚖𝚒𝚝 𝚎𝚡𝚌𝚎𝚎𝚍𝚎𝚍, 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚊𝚏𝚝𝚎𝚛 2 𝚑𝚘𝚞𝚛𝚜', event.threadID, event.messageID);
        } else if (errorMessage === 'Access Forbidden') {
          return api.sendMessage('𝚈𝚘𝚞 𝚊𝚛𝚎 𝚋𝚊𝚗𝚗𝚎𝚍 𝚋𝚢 𝚂𝚊𝚖𝚒𝚛 Œ', event.threadID, event.messageID);
        }
      }

      const imgurLink = imgurResponse.data.result.link;
      const url = await global.utils.uploadImgbb(imgurLink);
const pattern1 = /-\d+/;
const pattern2 = /-\d+?-n-png-stp-dst-png-p\d+x\d+-nc-cat-\d+-ccb-\d+-\d+-nc-sid/;
const filteredUrl = url.image.url.replace(pattern1, "").replace(pattern2, "");

    ;
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      await api.sendMessage({
        body: `☘ 𝙿𝚛𝚘𝚖𝚙𝚝: ${design}\n\n✨ 𝙻𝚒𝚗𝚔: ${filteredUrl}\n\n⏰ 𝙸𝚖𝚊𝚐𝚎 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎𝚍 𝚒𝚗 ${duration} 𝚜𝚎𝚌𝚘𝚗𝚍𝚜 ⏳ `,
        attachment: await global.utils.getStreamFromURL(imgurLink)
      }, event.threadID);
    } catch (error) {
      console.error(error);
      await api.sendMessage("𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚝𝚛𝚒𝚎𝚟𝚎 𝚒𝚖𝚊𝚐𝚎.", event.threadID);
    } finally {
      await api.unsendMessage(processingMessage.messageID);
    }
  }
};
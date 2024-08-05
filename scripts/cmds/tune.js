const axios = require("axios");
const yts = require('yt-search')
const ytdl = require('ytdl-core')
const fs = require('fs')



module.exports = {
  config: {
    name: "tune",
    aliases: ["karaoke","melody"],
    version: "1.0",
    author: "Arfan Mahim",
    role:0,
    category: "Music",
    guide: "Instantly get separate music and voice",
  },

  onStart: async function ({ event, message, args, api }) {
    

async function searchvid(searchstr) {

  const r = await yts(searchstr)
  let li = {}

  const v = r.videos[0]


    li.name = ` ${v.title} by ${v.author.name}`;
    li.author = `${v.author.name}`;
    li.duration = v.duration
    li.url = v.url

    return  li


}

    try {
      const song_name = args.join(" ").trim()+' karaoke';
      if (!song_name) {
        return message.reply('Please add a name');
      } else {
        const waitMessage = await message.reply("Audio is downloading!\nPlease Wait...(It may take up to 1 minute)");
        searchvid(song_name).then(song => {
          if (!song.name.toLowerCase().includes('karaoke')) {
            api.sendMessage('No karaoke found for that song', event.threadID, event.messageID)
          } else {
    
            // api.sendMessage(`Audio Downloading😃\n\nDETAILS: 
            // \nTitle: ${song.name}
            // \nAuthor: ${song.author}
            // \nDuration: ${song.duration}
    
            // `, event.threadID, event.messageID)
            const videoUrl = song.url;
    
            const vidname = event.senderID + process.hrtime.bigint()
            const options = {
              quality: 'highest',
              filter: 'audioonly',
            }
      
      
            const videoStream = fs.createWriteStream(__dirname + '/' + vidname + '.mp3')
      
      
            ytdl(videoUrl, options)
              .pipe(videoStream)
              .on('finish', async () => {
                console.log('Audio downloaded successfully!');
                // await api.sendMessage('Audio Downloaded and  uploading has started!\nPlease Wait...(It may take up to 1 minute)', event.threadID)
                    const outputFilePath = __dirname + '/' + vidname + '.mp3'
                    console.log('Video compressed successfully!');
                    await api.sendMessage({ body: 'Here:', attachment: fs.createReadStream(outputFilePath) }, event.threadID,
                  ()=>{
                            // Unsend the wait message
        api.unsendMessage(waitMessage.messageID);
                    fs.unlinkSync(outputFilePath)
                  })
                    fs.unlinkSync(outputFilePath)
                    
                  })
      
          }
    })

      }
    } catch (error) {
      console.error(error);
      message.reply("An error occurred.");
    }
  },
};

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class Judas {
  get config() {
    return {
      name: "runmocky",
      aliases: ["runm"],
      version: "1.0",
      author: "marrcus",
      countDown: 5, 
      role: 0,
      shortDescription: {
        en: "Ubah cmd ke runmocky"
      },
      longDescription: {
        en: "upload files to runmocky and sends the link to the file."
      },
      category: "Hadi",
      guide: {
        en: "{pn} <file>.js"
      }
    };
  }

  async onStart({ event, api, args }) {
    const permission = ["100004252636599"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("You don't have permission to use this command.", event.threadID, event.messageID);
    }

    const contents = args.join(" ");
    if (!contents) {
      api.sendMessage('Thiếu dữ liệu text!', event.threadID, event.messageID);
      return;
    }

    if (args.length === 1) {
      const fileName = args[0];
      const filePathWithoutExtension = path.join(__dirname, '..', 'cmds', fileName);
      const filePathWithExtension = path.join(__dirname, '..', 'cmds', fileName + '.js');

      if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
        return api.sendMessage('File not found!', event.threadID);
      }

      const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;

      fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
          console.error(err);
          return api.sendMessage('Error reading file!', event.threadID);
        }

        axios.post("https://api.mocky.io/api/mock", {
          "status": 200,
          "content": data,
          "content_type": "application/json",
          "charset": "UTF-8",
          "secret": "PhamMinhDong",
          "expiration": "never"
        }).then(function(response) {
          api.sendMessage(`Kết quả: ${response.data.link}`, event.threadID, event.messageID);
        }).catch(function(error) {
          console.error(error);
        });
      });
    } else {
      axios.post("https://api.mocky.io/api/mock", {
        "status": 200,
        "content": contents,
        "content_type": "application/json",
        "charset": "UTF-8",
        "secret": "PhamMinhDong",
        "expiration": "never"
      }).then(function(response) {
        api.sendMessage(`${response.data.link}`, event.threadID, event.messageID);
      }).catch(function(error) {
        console.error(error);
      });
    }
  }
}

module.exports = new Judas();
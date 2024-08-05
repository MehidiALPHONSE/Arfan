const axios = require('axios');
const { getStreamFromURL } = global.utils;

this.config = {
    name: "anime",
    version: "1.0.0",
    author: "LocDev",
    countDown: 0,
    role: 0,
    shortDescription: "media",
    longDescription: {
        vi: "gửi video anime nhanh",
        en: "just send anime video fast"
    },
    category: "media",
    guide: {
        vi: " ",
        en: ""
    }
},
    global.queuesabc = [];

this.onLoad = async function (o) {
    let status = false;
    const api_url = 'https://imagetotext-red.vercel.app/anime';
    if (!global.mmccffjjs) global.mmccffjjs = setInterval(_ => {
        if (status == true || global.queuesabc.length > 5) return;
        status = true;
        Promise.all([...Array(5)].map(e => axios.get(api_url).then(r => this.upload(r.data.url)))).then(res => (global.queuesabc.push(...res), status = false));
    }, 1000 * 5);
    this.upload = async function (url) {
        const videoStream = await getStreamFromURL(url);

        const form = {
            upload_1024: videoStream,
        };

        return o.api.postFormData('https://upload.facebook.com/ajax/mercury/upload.php',
            form).then(res => Object.entries(JSON.parse(res.body.replace('for (;;);', '')).payload?.metadata?.[0] || {})[0]);
    };
},
    this.onStart = async function (o) {
        let send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID));

        send({
            body: 'Video',
            attachment: global.queuesabc.splice(0, 1),
        });
    }
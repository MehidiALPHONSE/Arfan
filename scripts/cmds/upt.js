const os = require('os');
const moment = require('moment-timezone');
const fs = require('fs').promises;
const nodeDiskInfo = require('node-disk-info');

module.exports = {
    config: {
        name: "upt",
        version: "2.1.4", // Updated version for changes
        author: "Vtuan rmk Niio-team - Conver By LocDev",
        cooldowns: 5,
        role: 0,
        description: {
            vi: "Hiển thị thông tin hệ thống của bot!",
            en: "Show infomation system bot!"
        },
        category: "Hệ thống",
        guide: {
            vi: "",
            en: ""
        }
    },
    langs: {
		vi: {}, // Vietnamese language
		en: {} // English language
	},
    onStart: async ({ api, event, usersData }) => {
        const ping = Date.now();
        async function getDependencyCount() {
            try {
                const packageJsonString = await fs.readFile('package.json', 'utf8');
                const packageJson = JSON.parse(packageJsonString);
                const depCount = Object.keys(packageJson.dependencies).length;
                return depCount;
            } catch (error) {
                console.error('❎ Unable to read package.json file', error);
                return -1;
            }
        }
        function getStatusByPing(pingReal) {
            if (pingReal < 200) {
                return 'smooth';
            } else if (pingReal < 800) {
                return 'medium';
            } else {
                return 'lag';
            }  
        }
        function getPrimaryIP() {
            const interfaces = os.networkInterfaces();
            for (let iface of Object.values(interfaces)) {
                for (let alias of iface) {
                    if (alias.family === 'IPv4' && !alias.internal) {
                        return alias.address;
                    }
                }
            }
            return '127.0.0.1';
        }
        const a = await usersData.get(event.senderID); 
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const uptime = process.uptime();
        const uptimeHours = Math.floor(uptime / (60 * 60));
        const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);
        let name = a.name;
        const dependencyCount = await getDependencyCount();
        const botStatus = getStatusByPing(ping);
        const primaryIp = getPrimaryIP();
        try {
            const disks = await nodeDiskInfo.getDiskInfo();
            const firstDisk = disks[0] || {}; // Use the first disk, or an empty object if no disks are found
            const usedSpace = firstDisk.blocks - firstDisk.available;
            function convertToGB(bytes) {
                if (bytes === undefined) return 'N/A'; // Handle undefined value
                const GB = bytes / (1024 * 1024 * 1024);
                return GB.toFixed(2) + 'GB';
            }
            const pingReal = Date.now() - ping
            const replyMsg = `⏰ Now: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} | ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
⏱️ Time worked: ${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSeconds.toString().padStart(2, '0')}
📝 Default command mark: ${global.GoatBot.config.prefix}
🗂️ Number of packages: ${dependencyCount >= 0 ? dependencyCount : "Unknown"}
🔣 Bot status: ${botStatus}
📋 Operating system: ${os.type()} ${os.release()} (${os.arch()})
💾 CPU: ${os.cpus().length} core(s) - ${os.cpus()[0].model} @ ${Math.round(os.cpus()[0].speed)}MHz
📊 RAM: ${(usedMemory / 1024 / 1024 / 1024).toFixed(2)}GB/${(totalMemory / 1024 / 1024 / 1024).toFixed(2)}GB (đã dùng)
🛢️ Empty RAM: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)}GB
🗄️ Storage: ${convertToGB(firstDisk.used)}/${convertToGB(firstDisk.blocks)} (đã dùng)
📑 Empty Storage: ${convertToGB(firstDisk.available)}
🛜 Ping: ${pingReal}ms
👤 Request by: ${name}
 `.trim();
            api.sendMessage(replyMsg, event.threadID, event.messageID);
        } catch (error) {
            console.error('❎ Error getting disk information:', error.message);
        }
    }
};
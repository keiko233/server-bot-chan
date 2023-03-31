const os = require('os');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const token = JSON.parse(fs.readFileSync('./config.json')).token;
const bot = new TelegramBot(token, {polling: true});

function getSystemInfo() {
  const cpuLoad = (os.loadavg()[0] * 100).toFixed(2);
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = ((1 - freeMem / totalMem) * 100).toFixed(2);
  const cpuCount = os.cpus().length;
  const usedMem = (totalMem - freeMem) / 1024 / 1024 / 1024;
  const totalMemMB = totalMem / 1024 / 1024 / 1024;
  const userInfo = os.userInfo();
  const hostname = os.hostname();

  return {
    cpuLoad,
    totalMem,
    freeMem,
    memUsage,
    cpuCount,
    usedMem,
    totalMemMB,
    userInfo,
    hostname
  };
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '可用指令：\n/getinfo - 汇报信息');
});

bot.onText(/\/getinfo/, (msg) => {
  const chatId = msg.chat.id
  const info = getSystemInfo();
  const infoMsg = `Hostname: ${info.hostname}
CPU占用率: ${info.cpuLoad}%
CPU核心数量: ${info.cpuCount}
内存使用率: ${info.memUsage}%
已用内存: ${info.usedMem.toFixed(2)} GB
总计内存: ${info.totalMemMB.toFixed(2)} GB
当前用户: ${info.userInfo.username}`;
  bot.sendMessage(chatId, infoMsg);
});
const os = require('os');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const token = JSON.parse(fs.readFileSync('./config.json')).token;
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '可用指令：\n/info - 汇报信息');
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  const cpuLoad = os.loadavg()[0];
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = (1 - freeMem / totalMem).toFixed(2);
  const cpuCount = os.cpus().length;
  const usedMem = (totalMem - freeMem) / 1024 / 1024 / 1024;
  const totalMemMB = totalMem / 1024 / 1024 / 1024;
  const userInfo = os.userInfo();
  const hostname = os.hostname();
  
  const infoMsg = `Hostname: ${hostname}
CPU占用百分比: ${(cpuLoad * 100).toFixed(2)}%
CPU核心数量: ${cpuCount}
内存使用率: ${memUsage}
已用内存: ${usedMem.toFixed(2)} GB
总计内存: ${totalMemMB.toFixed(2)} GB
当前用户: ${userInfo.username}`;
  bot.sendMessage(chatId, infoMsg);
});
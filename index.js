const {
  getSystemInfo
} = require('./functions');
const { Telegraf } = require('telegraf');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));

const bot = new Telegraf(config.token);

const startInfo = `Elaina的服务器小Bot
可用指令：
/getinfo - 汇报服务器信息`;

bot.start((ctx) => ctx.reply(startInfo));
bot.help((ctx) => ctx.reply(startInfo));

bot.command('getinfo', async (ctx) => {
  const info = getSystemInfo();
  await ctx.reply(`Hostname: ${info.hostname}
CPU占用率: ${info.cpuLoad}%
CPU核心数量: ${info.cpuCount}
内存使用率: ${info.memUsage}%
已用内存: ${info.usedMem.toFixed(2)} GB
总计内存: ${info.totalMemMB.toFixed(2)} GB
当前用户: ${info.userInfo.username}
占用最高用户: ${info.highestCPUUsageUser}
占用最高进程: ${info.highestCPUUsageCommand}`)
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
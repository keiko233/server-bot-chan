const {
  getSystemInfo,
  getCPULoad
} = require('./functions');
const { Telegraf } = require('telegraf');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));

const bot = new Telegraf(config.token);

const startInfo = `Elaina的服务器小Bot
可用指令：
/getinfo - 汇报服务器信息
/wakeme - 服务器空闲时提醒我`;

bot.start((ctx) => ctx.reply(startInfo));
bot.help((ctx) => ctx.reply(startInfo));

bot.command('getinfo', async (ctx) => {
  const info = getSystemInfo();
  const replyMessage = `Hostname: ${info.hostname}
CPU占用率: ${info.cpuLoad}%
CPU核心数量: ${info.cpuCount}
内存使用率: ${info.memUsage}%
已用内存: ${info.usedMem.toFixed(2)} GB
总计内存: ${info.totalMemMB.toFixed(2)} GB
当前用户: ${info.userInfo.username}
占用最高用户: ${info.highestCPUUsageUser}
占用最高进程: ${info.highestCPUUsageCommand}`;
  await ctx.reply(replyMessage, {
    reply_to_message_id: ctx.message.message_id
  });
});

bot.command('wakeme', async (ctx) => {
  const chatId = ctx.chat.id;

  let count = 0;
  let loadCount = 0;
  const timeLimit = 60;
  const threshold = 5;

  const replyMessage = (time, cpuLoad) => {
    return `将会在服务器CPU负载低于${threshold}%持续${timeLimit}秒后提醒你。
计时器: ${time} 秒
当前CPU占用率: ${cpuLoad}%`
  }

  const sentMessage = await ctx.reply(replyMessage(count, getCPULoad()), {
    reply_to_message_id: ctx.message.message_id
  });

  const task = async () => {
    count++;
    loadCount += Number(getCPULoad());

    await ctx.telegram.editMessageText(chatId, sentMessage.message_id, null, replyMessage(count, getCPULoad()), {
      reply_to_message_id: ctx.message.message_id
    });

    if (count === timeLimit && (loadCount / timeLimit) < threshold) {
      clearInterval(interval);
      await ctx.reply('好耶，当前服务器空闲。', {
        reply_to_message_id: ctx.message.message_id
      })
    }
    else if (count === timeLimit && (loadCount / timeLimit) >= threshold) {
      count = 0;
      loadCount = 0;
    }
  };

  const interval = setInterval(task, 1000);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
import { Context, Telegraf } from 'telegraf';
import * as serverConfig from './config/config.json';
import {
  helpInfo,
  systemInfo
} from './strings';
import {
  getCPULoad
} from './utils';

interface BotContext extends Context {
  myProp?: string
  myOtherProp?: number
}

const bot = new Telegraf<BotContext>(serverConfig.token);

bot.start(async (ctx) => await ctx.reply(helpInfo));
bot.help(async (ctx) => await ctx.reply(helpInfo));

bot.command('getinfo', async (ctx) => {
  await ctx.reply(systemInfo(), {
    reply_to_message_id: ctx.message.message_id
  });
});

bot.command('wakeme', async (ctx) => {
  const chatId = ctx.chat.id;
  const messageId = ctx.message.message_id

  let count: number = 0;
  let loadCount: number = 0;
  const timeLimit: number = 60;
  const threshold: number = 5;

  const replyMessage = (time: number, cpuLoad: any) => {
    return `将会在服务器CPU负载低于${threshold}%持续${timeLimit}秒后提醒你。
计时器: ${time} 秒
当前CPU占用率: ${cpuLoad}%`
  }

  const sentMessage = await ctx.reply(replyMessage(count, getCPULoad()), {
    reply_to_message_id: messageId
  });

  const task = async () => {
    count++;
    loadCount += Number(getCPULoad());

    await ctx.telegram.editMessageText(chatId, sentMessage.message_id, null, replyMessage(count, getCPULoad()))

    if (count === timeLimit && (loadCount / timeLimit) < threshold) {
      clearInterval(interval);
      await ctx.reply('好耶，当前服务器空闲。', {
        reply_to_message_id: messageId
      })
    }
    else if (count === timeLimit && (loadCount / timeLimit) >= threshold) {
      count = 0;
      loadCount = 0;
    }
  };

  const interval = setInterval(task, 1000);
});

bot.launch()

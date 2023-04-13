import {
  getSystemInfo
} from './utils';

const helpInfo: string = `Elaina的服务器小Bot
可用指令：
/getinfo - 汇报服务器信息
/wakeme - 服务器空闲时提醒我
  可选参数：[时间限制] [CPU最低占用阀值]
  默认值: 60, 5`;

const systemInfo = () => {
  const info = getSystemInfo();
  return `Hostname: ${info.hostname}
CPU占用率: ${info.cpuLoad}%
CPU核心数量: ${info.cpuCount}
内存使用率: ${info.memUsage}%
已用内存: ${info.usedMem.toFixed(2)} GB
总计内存: ${info.totalMemMB.toFixed(2)} GB
当前用户: ${info.userInfo.username}
占用最高用户: ${info.highestCPUUsageUser}
占用最高进程: ${info.highestCPUUsageCommand}`
};

export {
  helpInfo,
  systemInfo
}

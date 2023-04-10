const os = require('os');
const { execSync } = require('child_process');

function getHighestCPUUsageUser() {
  const command = "top -b -n1 | awk 'NR>7 {a[$2]+=$9} END {for (i in a) print a[i],i | \"sort -rn\"} ' | head -n 1 | awk '{print $2}'";
  return execSync(command).toString().trim();
}

function getHighestCPUUsageCommand() {
  const command = "top -b -n1 | awk 'NR>7 {print $12,$9}' | sort -rnk2 | head -n1 | awk '{print $1}'";
  return execSync(command).toString().trim();
}

function getCPUCount() {
  return os.cpus().length;
}

function getCPULoad() {
  const user = Number(execSync("top -b -n1 | awk 'NR<6' | awk 'NR>2' | head -n1 | awk '{print $2}'"));
  const system = Number(execSync("top -b -n1 | awk 'NR<6' | awk 'NR>2' | head -n1 | awk '{print $4}'"));
  return (user + system).toFixed(2);
}

function getSystemInfo() {
  const cpuLoad = getCPULoad();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = ((1 - freeMem / totalMem) * 100).toFixed(2);
  const cpuCount = getCPUCount();
  const usedMem = (totalMem - freeMem) / 1024 / 1024 / 1024;
  const totalMemMB = totalMem / 1024 / 1024 / 1024;
  const userInfo = os.userInfo();
  const hostname = os.hostname();
  const highestCPUUsageUser = getHighestCPUUsageUser();
  const highestCPUUsageCommand = getHighestCPUUsageCommand();

  return {
    cpuLoad,
    totalMem,
    freeMem,
    memUsage,
    cpuCount,
    usedMem,
    totalMemMB,
    userInfo,
    hostname,
    highestCPUUsageUser,
    highestCPUUsageCommand
  };
}

module.exports = {
  getHighestCPUUsageUser,
  getHighestCPUUsageCommand,
  getCPUCount,
  getCPULoad,
  getSystemInfo
}
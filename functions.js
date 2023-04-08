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
  const command = "top -b -n1 | awk 'NR<6' | awk 'NR>2' | head -n1 | awk '{print $8}'";
  return (100 - Number(execSync(command))).toFixed(2);
}

module.exports = {
  getHighestCPUUsageUser,
  getHighestCPUUsageCommand,
  getCPUCount,
  getCPULoad
}
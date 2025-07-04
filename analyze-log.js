const fs = require('fs');
const os = require('os');

const realPath = os.homedir() + '/Desktop/Us/real_data/';
if (!fs.existsSync(realPath)) fs.mkdirSync(realPath, { recursive: true });

const LOG_PATH = realPath + 'logs.json';

if (!fs.existsSync(LOG_PATH)) {
  console.log('❌ Log file does not exist');
  process.exit(1);
}

const logs = JSON.parse(fs.readFileSync(LOG_PATH));
const result = {};
const onlineMap = {};

function formatOnlineTime(seconds) {
  const sec = Math.round(seconds || 0);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

for (const log of logs) {
  const userId = log.userId || 'unknown';
  const dateObj = new Date(log.timestamp);
  const date = dateObj.toISOString().split('T')[0];
  const event = log.event;

  if (!result[userId]) result[userId] = {};
  if (!result[userId][date]) result[userId][date] = {};
  if (!result[userId][date][event]) result[userId][date][event] = 0;
  result[userId][date][event] += 1;

  if (!result[userId][date]['mood_A']) result[userId][date]['mood_A'] = 0;
  if (!result[userId][date]['mood_B']) result[userId][date]['mood_B'] = 0;
  if (!result[userId][date]['mood_C']) result[userId][date]['mood_C'] = 0;
  if (!result[userId][date]['total_online_seconds']) result[userId][date]['total_online_seconds'] = 0;

  if (!onlineMap[userId]) onlineMap[userId] = {};
  if (!onlineMap[userId][date]) onlineMap[userId][date] = { openTime: null };

  if (event === 'open_app') {
    onlineMap[userId][date].openTime = dateObj.getTime();
  } else if (event === 'close_app' && onlineMap[userId][date].openTime) {
    const session = (dateObj.getTime() - onlineMap[userId][date].openTime) / 1000;
    if (session > 0 && session < 86400) {
      result[userId][date]['total_online_seconds'] += session;
    }
    onlineMap[userId][date].openTime = null;
  }

  if (event === 'post_emotion') {
    try {
      const detail = JSON.parse(log.target);
      if (detail.mood === 'A') result[userId][date]['mood_A'] += 1;
      if (detail.mood === 'B') result[userId][date]['mood_B'] += 1;
      if (detail.mood === 'C') result[userId][date]['mood_C'] += 1;
    } catch {}
  }
}

const headers = [
  'userId', 'date', 'online_time', 'join_us', 'react_post', 'comment_post', 'post_emotion', 'mood_A', 'mood_B', 'mood_C'
];

const jsonFile = realPath + 'all_users_stats.json';
fs.writeFileSync(jsonFile, JSON.stringify(result, null, 2));
console.log(`✅ Exported JSON: ${jsonFile}`);

let csv = headers.join(',') + '\n';
for (const userId in result) {
  for (const date in result[userId]) {
    const totalSeconds = result[userId][date]['total_online_seconds'] || 0;
    const row = [
      userId,
      date,
      formatOnlineTime(totalSeconds),
      result[userId][date]['join_us'] || 0,
      result[userId][date]['react_post'] || 0,
      result[userId][date]['comment_post'] || 0,
      result[userId][date]['post_emotion'] || 0,
      result[userId][date]['mood_A'] || 0,
      result[userId][date]['mood_B'] || 0,
      result[userId][date]['mood_C'] || 0
    ];
    csv += row.join(',') + '\n';
  }
}
const csvFile = realPath + 'all_users_stats.csv';
fs.writeFileSync(csvFile, csv);
console.log(`✅ Exported summary CSV: ${csvFile}`);

for (const userId in result) {
  let userCsv = headers.join(',') + '\n';
  for (const date in result[userId]) {
    const totalSeconds = result[userId][date]['total_online_seconds'] || 0;
    const row = [
      userId,
      date,
      formatOnlineTime(totalSeconds),
      result[userId][date]['join_us'] || 0,
      result[userId][date]['react_post'] || 0,
      result[userId][date]['comment_post'] || 0,
      result[userId][date]['post_emotion'] || 0,
      result[userId][date]['mood_A'] || 0,
      result[userId][date]['mood_B'] || 0,
      result[userId][date]['mood_C'] || 0
    ];
    userCsv += row.join(',') + '\n';
  }
  const userCsvFile = realPath + `user_${userId}_stats.csv`;
  fs.writeFileSync(userCsvFile, userCsv);
  console.log(`✅ Exported CSV for user ${userId}: ${userCsvFile}`);
}

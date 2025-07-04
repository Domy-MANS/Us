const fs = require('fs');
const os = require('os');
const fakePath = os.homedir() + '/Desktop/Us/fake_data/';
if (!fs.existsSync(fakePath)) fs.mkdirSync(fakePath, { recursive: true });
const LOG_PATH = fakePath + 'logs_fake.json';
let logs = [];
const users = ['testUser001', 'testUser002', 'testUser003'];
const usNames = ['TeenagerUs', 'ENFPUs', 'WorkerUs', 'AdultUs'];
const days = 7;
const now = new Date();
now.setHours(0, 0, 0, 0);
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
for (const user of users) {
  let onlineBase = 20 + randomInt(0, 15);
  let joinBase = 3 + randomInt(0, 3);
  let reactBase = 4 + randomInt(0, 3);
  let commentBase = 5 + randomInt(0, 3);
  let baseB = 0.18 + Math.random() * 0.12;
  let baseC = 0.25 + Math.random() * 0.10;
  for (let d = 0; d < days; d++) {
    const dayDate = new Date(now.getTime() - (days - 1 - d) * 24 * 3600 * 1000);
    dayDate.setHours(0, 0, 0, 0);
    const onlineMinutes = Math.round(onlineBase + d * (8 + Math.random() * 5) + randomInt(-4, 7));
    const onlineSeconds = onlineMinutes * 60;
    const joinUsToday = Math.max(1, Math.round(joinBase + d * (0.8 + Math.random() * 0.7) + randomInt(-1, 2)));
    const reactToday = Math.max(1, Math.round(reactBase + d * (1.3 + Math.random() * 0.8) + randomInt(-2, 3)));
    const commentToday = Math.max(1, Math.round(commentBase + d * (1.1 + Math.random() * 0.7) + randomInt(-2, 4)));
    const postsToday = Math.max(4, Math.round(5 + d * (1.0 + Math.random() * 0.7) + randomInt(-1, 3)));
    const moodBRate = Math.min(0.68, baseB + d * 0.08 + Math.random() * 0.03);
    const moodCRate = Math.max(0.03, baseC - d * 0.04 + Math.random() * 0.02);
    let moodACount = 0, moodBCount = 0, moodCCount = 0;
    let openHour = 9 + randomInt(0, 2);
    let openTime = new Date(dayDate.getTime() + openHour * 3600 * 1000 + randomInt(0, 1800 * 1000));
    let closeTime = new Date(openTime.getTime() + onlineSeconds * 1000);
    logs.push({ userId: user, timestamp: openTime.toISOString(), event: 'open_app', target: openTime.toISOString() });
    logs.push({ userId: user, timestamp: closeTime.toISOString(), event: 'close_app', target: closeTime.toISOString() });
    for (let i = 0; i < postsToday; i++) {
      let mood;
      const r = Math.random();
      if (r < moodBRate) { mood = 'B'; moodBCount++; }
      else if (r < moodBRate + moodCRate) { mood = 'C'; moodCCount++; }
      else { mood = 'A'; moodACount++; }
      let postTime = new Date(openTime.getTime() + (closeTime.getTime() - openTime.getTime()) * (i + 1) / (postsToday + 1));
      logs.push({
        userId: user,
        timestamp: postTime.toISOString(),
        event: 'post_emotion',
        target: JSON.stringify({
          us: usNames[randomInt(0, usNames.length - 1)],
          mood
        })
      });
    }
    for (let i = 0; i < joinUsToday; i++) {
      let t = new Date(openTime.getTime() + (closeTime.getTime() - openTime.getTime()) * Math.random());
      logs.push({
        userId: user,
        timestamp: t.toISOString(),
        event: 'join_us',
        target: usNames[randomInt(0, usNames.length - 1)]
      });
    }
    for (let i = 0; i < reactToday; i++) {
      let t = new Date(openTime.getTime() + (closeTime.getTime() - openTime.getTime()) * Math.random());
      logs.push({
        userId: user,
        timestamp: t.toISOString(),
        event: 'react_post',
        target: randomInt(10000, 99999).toString()
      });
    }
    for (let i = 0; i < commentToday; i++) {
      let t = new Date(openTime.getTime() + (closeTime.getTime() - openTime.getTime()) * Math.random());
      logs.push({
        userId: user,
        timestamp: t.toISOString(),
        event: 'comment_post',
        target: randomInt(10000, 99999).toString()
      });
    }
  }
}
fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));
console.log(`✅ Fake log file has been generated: ${LOG_PATH}, Number of users: ${users.length}, Number of days: ${days}`);
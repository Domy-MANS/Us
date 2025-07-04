const express = require('express');
const cors = require('cors');
const fs = require('fs');
const os = require('os');
const app = express();
const PORT = 4000;
const userSessions = {};

const realPath = os.homedir() + '/Desktop/Us/real_data/';
if (!fs.existsSync(realPath)) fs.mkdirSync(realPath, { recursive: true });
const LOG_PATH = realPath + 'logs.json';

app.use(cors());
app.use(express.json());

app.post('/log', (req, res) => {
  const log = req.body;

  if (log.event === 'open_app') {
    userSessions[log.userId] = log.target;
    console.log(`🚪 User ${log.userId || 'unknown'} opened the app, time: ${log.target}`);
  }

  if (log.event === 'close_app') {
    const openTimeStr = userSessions[log.userId];
    const closeTimeStr = log.target;
    if (openTimeStr && closeTimeStr) {
      const openTime = new Date(openTimeStr);
      const closeTime = new Date(closeTimeStr);
      let curr = new Date(openTime);
      let summary = [];
      while (curr < closeTime) {
        let nextDay = new Date(curr);
        nextDay.setHours(23, 59, 59, 999);
        let end = closeTime < nextDay ? closeTime : nextDay;
        let durationMs = end - curr + 1;
        let dateStr = curr.toISOString().split('T')[0];
        summary.push({
          date: dateStr,
          minutes: Math.round(durationMs / 1000 / 60)
        });
        curr = new Date(end.getTime() + 1);
      }
      for (const day of summary) {
        console.log(`🗓️  User ${log.userId} was actually online on ${day.date}: ${day.minutes} minutes`);
      }
      delete userSessions[log.userId];
    } else {
      console.log(`👋 User ${log.userId || 'unknown'} exited the app, time: ${closeTimeStr}, duration: unable to calculate`);
    }
  }

  let logs = [];
  if (fs.existsSync(LOG_PATH)) {
    logs = JSON.parse(fs.readFileSync(LOG_PATH));
  }
  logs.push(log);
  fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));

  console.log(`✅ Latest action: ${log.event} → ${log.target}\n`);

  try {
    const detail = JSON.parse(log.target);
    if (detail.mood) {
      const moodMap = { A: '😢 Sad', B: '😊 Happy', C: '😟 Anxious' };
      console.log(`   📌 Mood type: ${moodMap[detail.mood] || detail.mood}`);
    }
  } catch (e) {}

  console.log('📥 Received log: ', JSON.stringify(log, null, 2));

  const result = {};
  for (const l of logs) {
    const userId = l.userId || 'unknown';
    const date = new Date(l.timestamp).toISOString().split('T')[0];
    const event = l.event;

    if (!result[userId]) result[userId] = {};
    if (!result[userId][date]) result[userId][date] = {};
    if (!result[userId][date][event]) result[userId][date][event] = 0;
    result[userId][date][event] += 1;

    if (!result[userId][date]['mood_A']) result[userId][date]['mood_A'] = 0;
    if (!result[userId][date]['mood_B']) result[userId][date]['mood_B'] = 0;
    if (!result[userId][date]['mood_C']) result[userId][date]['mood_C'] = 0;

    if (event === 'post_emotion') {
      try {
        const detail = JSON.parse(l.target);
        if (detail.mood === 'A') result[userId][date]['mood_A'] += 1;
        if (detail.mood === 'B') result[userId][date]['mood_B'] += 1;
        if (detail.mood === 'C') result[userId][date]['mood_C'] += 1;
      } catch {}
    }
  }

  const todayOnly = new Date().toISOString().split('T')[0];
  let printed = false;

  for (const userId in result) {
    for (const date in result[userId]) {
      if (date !== todayOnly) continue;

      const stats = result[userId][date];
      console.log(`📅 ${date} | 👤 ${userId}`);
      console.log(`   ➤ Joined Us: ${stats.join_us || 0}`);
      console.log(`   ➤ Posts: ${stats.post_emotion || 0}`);
      console.log(`   ➤ Interactions: ${stats.react_post || 0}`);
      console.log(`   ➤ Comments: ${stats.comment_post || 0}`);
      console.log(`   📊 Mood statistics: 😭 ${stats.mood_A || 0} 😎 ${stats.mood_B || 0} 😟 ${stats.mood_C || 0}\n`);
      printed = true;
    }
  }

  if (!printed) {
    console.log(`📭 No user behavior data for today`);
  }

  res.json({ message: '✅ Behavior recorded' });
});

app.get('/daily-stats/:userId', (req, res) => {
  const userId = req.params.userId;
  const today = new Date().toISOString().split('T')[0];

  if (!fs.existsSync(LOG_PATH)) {
    return res.status(404).json({ error: 'No log found' });
  }

  const logs = JSON.parse(fs.readFileSync(LOG_PATH));
  const stats = {
    interact: 0,
    mood_A: 0,
    mood_B: 0,
    mood_C: 0
  };

  for (const log of logs) {
    if (log.userId !== userId) continue;
    const logDate = new Date(log.timestamp).toISOString().split('T')[0];
    if (logDate !== today) continue;

    if (log.event === 'react_post' || log.event === 'comment_post') {
      stats.interact += 1;
    }

    if (log.event === 'post_emotion') {
      try {
        const detail = JSON.parse(log.target);
        if (detail.mood === 'A') stats.mood_A += 1;
        if (detail.mood === 'B') stats.mood_B += 1;
        if (detail.mood === 'C') stats.mood_C += 1;
      } catch {}
    }
  }

  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`📊 User behavior log service running at: http://localhost:${PORT}`);
});

const Pusher = require('pusher');

let leaderboard = [
  { name: '玩家A', time: 32 },
  { name: '玩家B', time: 40 },
  { name: '玩家C', time: 55 }
];

const pusher = new Pusher({
  appId: '2042847',
  key: 'a157f9363899aea38ec7',
  secret: 'e53108f58771e9ce2f61',
  cluster: 'ap1',
  useTLS: true
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method === 'POST') {
    const { name, time } = req.body;
    if (!name || typeof time !== 'number') {
      res.status(400).json({ error: '参数错误' });
      return;
    }
    leaderboard.push({ name, time });
    leaderboard.sort((a, b) => a.time - b.time);
    leaderboard = leaderboard.slice(0, 10);
    await pusher.trigger('leaderboard', 'update', { leaderboard });
    res.status(200).json({ success: true, leaderboard });
  } else {
    res.status(405).json({ error: '只支持 POST' });
  }
};

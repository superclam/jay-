let leaderboard = [
  { name: '玩家A', time: 32 },
  { name: '玩家B', time: 40 },
  { name: '玩家C', time: 55 }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  res.status(200).json({ leaderboard });
};

const express = require('express');
const Pusher = require('pusher');
const http = require('http');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// 配置Pusher
const pusher = new Pusher({
  appId: "2042847",
  key: "a157f9363899aea38ec7",
  secret: "e53108f58771e9ce2f61",
  cluster: "ap1",
  useTLS: true
});

// 存储在线用户
const onlineUsers = new Map();

// 中间件
app.use(cors());
app.use(express.json());

// 获取在线用户数量
app.get('/api/online-count', (req, res) => {
  res.json({ count: onlineUsers.size });
});

// 用户加入
app.post('/api/join', (req, res) => {
  const userId = uuidv4();
  const userName = req.body.userName || `用户${Math.floor(Math.random() * 1000)}`;

  // 添加到在线用户列表
  onlineUsers.set(userId, {
    id: userId,
    name: userName,
    joinedAt: new Date()
  });

  // 触发用户加入事件
  pusher.trigger('online-channel', 'user-joined', {
    userId,
    userName,
    totalUsers: onlineUsers.size
  });

  // 获取所有在线用户
  const allUsers = Array.from(onlineUsers.values());

  res.json({
    userId,
    userName,
    totalUsers: onlineUsers.size,
    allUsers
  });
});

// 用户离开
app.post('/api/leave', (req, res) => {
  const { userId } = req.body;

  if (userId && onlineUsers.has(userId)) {
    const user = onlineUsers.get(userId);
    onlineUsers.delete(userId);

    // 触发用户离开事件
    pusher.trigger('online-channel', 'user-left', {
      userId,
      userName: user.name,
      totalUsers: onlineUsers.size
    });

    res.json({ success: true, totalUsers: onlineUsers.size });
  } else {
    res.status(400).json({ error: '无效的用户ID' });
  }
});

// 处理断开连接
server.on('close', () => {
  // 服务器关闭时，通知所有客户端
  pusher.trigger('online-channel', 'server-disconnected', {
    message: '服务器已断开连接'
  });
});

// 设置服务器端口
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');

// Route imports
const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/Tournaments');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const leaderboardRoutes = require('./routes/leaderboard');
const profileRoutes = require('./routes/profile');
const matchRoutes = require('./routes/match');
const friendRoutes = require('./routes/friend');
const squadRoutes = require('./routes/squads');
const Message = require('./models/Message');
const messageRoutes = require('./routes/messages')
const xpHistoryRoutes = require('./routes/matchxp');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/squads', squadRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// --- SOCKET.IO LIVE CHAT SECTION ---

const onlineUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Unauthorized'));
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  onlineUsers.set(socket.userId, socket);

  // Squad chat room
  socket.on('join-squad', (squadId) => {
    socket.join(`squad-${squadId}`);
  });

  socket.on('send-squad-message', ({ squadId, message }) => {
    io.to(`squad-${squadId}`).emit('receive-message', {
      senderId: socket.userId,
      message,
      timestamp: Date.now(),
    });
  });

  // Direct message
  socket.on('send-dm', ({ toUserId, message }) => {
    const recipientSocket = onlineUsers.get(toUserId);
    if (recipientSocket) {
      recipientSocket.emit('receive-dm', {
        senderId: socket.userId,
        message,
        timestamp: Date.now(),
      });
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.userId);
  });
});

// Start server with WebSocket
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server and Socket.IO running on port ${PORT}`);
});

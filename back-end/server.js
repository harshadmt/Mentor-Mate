const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require('./config/db');
const VideoSessionService = require('./Services/VideoSessionServices/VideoSession');
const NotificationService = require('./Services/NotifactionServices/notificationservice');

// Load env variables
dotenv.config();

// Route imports
const authRoutes = require('./router/authRoute');
const protectedRoute = require('./router/protectRouter');
const RoadmapRoutes = require('./router/roadMapRoute');
const userRoute = require('./router/userRoute');
const paymentRouter = require('./router/paymentRoute');
const studentRouter = require('./router/studentRoute');
const messageRoutes = require('./router/messageRoute');
const mentorRoutes = require('./router/mentorRoute');
const VideoSessionRoutes = require('./router/videoSessionRoute');;
const notificationRoutes = require('./router/notificationRouter')
const adminRoutes = require('./router/AdminRoutes')
const errorHandling = require('./middleware/errorMiddleWare');


const app = express();
const server = http.createServer(app);


db();

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);

  // 🔹 Chat room join
  socket.on('joinRoom', (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // 🔹 Real-time chat
  socket.on('sendMessage', async (data) => {
    if (!data.roomId || !data.sender || !data.receiver || !data.content) return;

    io.to(data.roomId).emit('receiveMessage', {
      ...data,
      createdAt: new Date()
    });

    //  Create notification for receiver
    try {
      await NotificationService.createNotification({
        user: data.receiver,
        type: 'message',
        message: `New message from mentor`,
        link: `/student/chat/${data.sender}`
      });
    } catch (err) {
      console.error('Notification Error (message):', err);
    }
  });

  //  WebRTC: join video room
  socket.on('join-room', async ({ roomId, userId }) => {
    if (!roomId || !userId) return;
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;

    try {
      await VideoSessionService.markSessionStart(roomId);
      console.log(`🔗 ${userId} joined video room ${roomId}`);
    } catch (error) {
      console.error(' Failed to mark session start:', error.message);
    }

    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
  });

  //  WebRTC signaling
  socket.on('offer', ({ target, offer }) => {
    io.to(target).emit('receive-offer', { sender: socket.id, offer });
  });

  socket.on('answer', ({ target, answer }) => {
    io.to(target).emit('receive-answer', { sender: socket.id, answer });
  });

  socket.on('ice-candidate', ({ target, candidate }) => {
    io.to(target).emit('receive-ice-candidate', { sender: socket.id, candidate });
  });

  //  WebRTC: disconnect
  socket.on('disconnect', async () => {
    const { roomId, userId } = socket;
    if (roomId && userId) {
      socket.to(roomId).emit('user-disconnected', { userId });
      try {
        await VideoSessionService.markSessionEnd(roomId);
        console.log(`📴 User ${userId} disconnected from ${roomId}, session marked complete.`);
      } catch (error) {
        console.error('Failed to mark session end:', error.message);
      }
    } else {
      console.log(`Socket ${socket.id} disconnected.`);
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

//  Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Attach io instance to app
app.set('io', io);

//API Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoute);
app.use('/api/roadmaps', RoadmapRoutes);
app.use('/api/user', userRoute);
app.use('/api/payment', paymentRouter);
app.use('/api/student', studentRouter);
app.use('/api/message', messageRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/videosession', VideoSessionRoutes);
app.use('/api/notifications',notificationRoutes);
app.use('/api/admin',adminRoutes)

// Global error handler
app.use(errorHandling);

//  Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

//  Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;

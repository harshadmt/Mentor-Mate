const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
require('dotenv').config();


const authRoutes = require('./router/authRoute');
const protectedRoute = require('./router/protectRouter');
const RoadmapRoutes = require('./router/roadMapRoute');
const userRoute = require('./router/userRoute');
const paymentRouter = require('./router/paymentRoute');
const studentRouter = require('./router/studentRoute');
const messageRoutes = require('./router/messageRoute');
const mentorRoutes = require('./router/mentorRoute');
const errorHandling = require('./middleware/errorMiddleWare');

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  pingTimeout: 60000, 
  pingInterval: 25000, 
});


db();


io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  
  socket.on('joinRoom', (roomId) => {
    try {
      if (!roomId) {
        throw new Error('Room ID is required');
      }
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    } catch (error) {
      console.error('Error joining room:', error.message);
    }
  });

  socket.on('sendMessage', async (data) => {
    try {
      if (!data.roomId || !data.sender || !data.receiver || !data.content) {
        throw new Error('Missing required message fields');
      }
      
      
      io.to(data.roomId).emit('receiveMessage', {
        ...data,
        createdAt: new Date()
      });
      
      console.log(`Message sent to room ${data.roomId}`);
    } catch (error) {
      console.error('Error sending message:', error.message);
      socket.emit('messageError', { error: error.message });
    }
  });

 
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.set('io', io);


app.use('/api/auth', authRoutes);
app.use('/api', protectedRoute);
app.use('/api/roadmaps', RoadmapRoutes);
app.use('/api/user', userRoute);
app.use('/api/payment', paymentRouter);
app.use('/api/student', studentRouter);
app.use('/api/message', messageRoutes);
app.use('/api/mentor', mentorRoutes);


app.use(errorHandling);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;
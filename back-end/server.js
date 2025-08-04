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
const mentorRoutes = require('./router/mentorRoute')
const errorHandling = require('./middleware/errorMiddleWare');


const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});


db();


io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

 
  
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  
  socket.on('sendMessage', async (data) => {
    try {
   
      io.to(data.roomId).emit('receiveMessage', data);
      console.log(`Message sent to room ${data.roomId}`);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api', protectedRoute);
app.use('/api/roadmaps', RoadmapRoutes);
app.use('/api/user', userRoute);
app.use('/api/payment', paymentRouter);
app.use('/api/student', studentRouter);
app.use('/api/messages', messageRoutes);
app.use('/api/mentor',mentorRoutes )


app.use(errorHandling);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
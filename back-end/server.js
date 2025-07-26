const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRoutes = require('./router/authRoute');
const protectedRoute = require('./router/protectRouter');
const RoadmapRoutes = require('./router/roadMapRoute')
const userRoute = require('./router/userRoute')
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,               
}));

app.use(express.json());
app.use(cookieParser());
db();

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoute);
app.use('/api/roadmaps',RoadmapRoutes)
app.use('/api/user',userRoute)

app.listen(process.env.PORT, () => {
  console.log('Server is Running');
});

module.exports = app;

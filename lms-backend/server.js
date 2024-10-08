require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/uploads');
const authRoutes = require('./routes/auth');
const Message = require('./models/message'); // Import the Message model

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL (change this to your Vercel URL if necessary)
    methods: ["GET", "POST"]
  }
});

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// API Routes
app.use('/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/uploads', uploadRoutes);

// Connect to MongoDB
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 5000, // Timeout for initial connection to the MongoDB server
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Ensure upload directory exists
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'corporate-lms/build')));

// The "catchall" handler: for any request that doesn't match the above routes, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'corporate-lms/build', 'index.html'));
});

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', ({ room }) => {
      socket.join(room);
      console.log(`Client joined room: ${room}`);
  });

  socket.on('leaveRoom', ({ room }) => {
      socket.leave(room);
      console.log(`Client left room: ${room}`);
  });

  socket.on('sendMessage', async ({ room, message }) => {
      try {
          // Save message to the database
          const savedMessage = await new Message({
              content: message.content,
              sender: message.sender._id, // This should be the user ID
              course: room,
          }).populate('sender', 'username').save();

          // Emit the saved message back to the room
          io.to(room).emit('receiveMessage', savedMessage);
      } catch (error) {
          console.error('Error saving message:', error);
      }
  });

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });
});

// Server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

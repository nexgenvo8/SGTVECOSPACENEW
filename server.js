const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});

app.use(cors());
app.use(express.json());

let messages = []; // Temporary message storage (use DB in production)

// WebSocket connection
io.on('connection', (socket) => {
  console.log('🔥 User connected:', socket.id);

  // Send previous messages when a user joins
  socket.emit('previousMessages', messages);

  // Listen for incoming messages
  socket.on('sendMessage', (message) => {
    messages.push(message); // Store message
    io.emit('receiveMessage', message); // Broadcast to all users
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// API to fetch messages (optional for debugging)
app.get('/messages', (req, res) => {
  res.json({ messages });
});

// Start server
server.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});

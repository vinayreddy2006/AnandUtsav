// server.js
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();


import cors from 'cors';
import http from 'http'; 
import { Server } from 'socket.io'; 

import connectDB from './config/db.js';
import { notFound } from './middlewares/error.js';


import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import serviceProviderRoutes from './routes/serviceProviderRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js'; 
import messageRoutes from './routes/messageRoutes.js';         



connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app

// --- Middleware ---
app.use(cors());
app.use(express.json());


// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', serviceProviderRoutes);

app.use('/api/conversations', conversationRoutes); 
app.use('/api/messages', messageRoutes);           

app.get('/', (req, res) => {
  res.send('AnandUtsav API is running...');
});

// --- Error Handling ---
app.use(notFound);

// --- Server Listening ---
const PORT = process.env.PORT || 3004;
server.listen(PORT, console.log(`Server running on port ${PORT}`));


// SOCKET.IO INITIALIZATION

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
  },
});

io.on("connection", (socket) => {
  console.log("A user connected to socket.io");

  // User joins a personal room based on their own MongoDB ID
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
    console.log(`User room created for: ${userData._id}`); 
  });

  // User joins a specific conversation room
  socket.on("join conversation", (room) => {
    socket.join(room);
    console.log("User joined conversation room: " + room);
  });

  // Typing indicators
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // Handling a new message
  socket.on("new message", (newMessageRecieved) => {
    let conversation = newMessageRecieved.conversation;

    if (!conversation || !conversation.participants) {
        return console.log("Message received without conversation participants.");
    }

    // Send the message to every participant in the conversation except the sender
    conversation.participants.forEach((participant) => {
      const participantId = participant._id ? participant._id.toString() : participant.toString();
      const senderId = newMessageRecieved.sender._id.toString();
      
      if (participantId === senderId) return;

      // Emit the "message received" event to the participant's personal room
      socket.in(participantId).emit("message received", newMessageRecieved);
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
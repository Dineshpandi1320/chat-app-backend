const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
 
// Specify the allowed origin (your frontend domain)
const allowedOrigin = "https://genuine-kringle-8bfe0a.netlify.app"; // Replace with your frontend domain
 
app.use(
  cors({
    origin: allowedOrigin, // Allow requests only from your frontend domain
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials (cookies, authorization headers)
  })
);
 
const PORT = process.env.PORT || 3002;
const server = http.createServer(app);
 
const io = new Server(server, {
  cors: {
    origin: allowedOrigin, // Allow WebSocket connections from your frontend domain
    methods: ["GET", "POST"],
  },
});
 
io.on("connection", (socket) => {
  console.log(`User_connected ${socket.id}`);
 
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
 
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("received_message", data);
  });
 
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
 
server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
 
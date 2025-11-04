import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config'; 
import app from './src/app.js';
// import setupSocket from './src/socket/index.js'; // We will create this later

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

// === Setup Socket.io ===
// (We will uncomment and build this in a later step)
// const io = new Server(server, {
//   cors: {
//     origin: '*', // For development
//     methods: ['GET', 'POST'],
//   },
// });

// setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});

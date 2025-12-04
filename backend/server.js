import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config'; 
import app from './src/app.js';
import setupSocket from './src/socket/index.js'; 

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});

// "use client";

// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL 
//   ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
//   : 'http://localhost:8080';

// export function useSocket(documentId) {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Initialize socket with reconnection options
//     const socketIo = io(SOCKET_URL, {
//       reconnection: true,        // Enable auto-reconnection
//       reconnectionAttempts: 5,   // Try 5 times
//       reconnectionDelay: 1000,   // Wait 1s between attempts
//     });

//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setSocket(socketIo);

//     return () => {
//       socketIo.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!socket || !documentId) return;

//     // Join the room
//     socket.emit('join-document', documentId);

//     // EDGE CASE: Handle Reconnection
//     // If the server restarts, we need to re-join the room automatically
//     const handleConnect = () => {
//       console.log("Reconnected to server, re-joining room...");
//       socket.emit('join-document', documentId);
//     };

//     socket.on('connect', handleConnect);

//     return () => {
//       socket.off('connect', handleConnect);
//     };
//   }, [socket, documentId]);

//   return socket;
// }


"use client";

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
  : 'http://localhost:8080';

export function useSocket(documentId, user) {
  const [socket, setSocket] = useState(null);

  // 1. Connect
  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socketIo);
    return () => { socketIo.disconnect(); };
  }, []);

  // 2. Join Room with User Info
  useEffect(() => {
    if (!socket || !documentId || !user) return;

    const handleConnect = () => {
      // Send user info along with join request
      socket.emit('join-document', { documentId, user });
    };

    if (socket.connected) handleConnect();
    
    socket.on('connect', handleConnect);
    return () => { socket.off('connect', handleConnect); };
  }, [socket, documentId, user]);

  return socket;
}
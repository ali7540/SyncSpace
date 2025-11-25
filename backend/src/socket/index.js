// /**
//  * Socket.io Handler
//  * Manages real-time collaboration rooms.
//  */
// export default function setupSocket(io) {
//   io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // 1. Join a specific document room
//     socket.on('join-document', (documentId) => {
//       socket.join(documentId);
//       console.log(`User ${socket.id} joined document: ${documentId}`);
//     });

//     // 2. Handle incoming changes from a client
//     socket.on('send-changes', (data) => {
//       const { documentId, newContent } = data;
      
//       // Broadcast changes to everyone ELSE in the room
//       // socket.to(...) excludes the sender, preventing echo loops
//       socket.to(documentId).emit('receive-changes', newContent);
//     });

//     // 3. Handle disconnection
//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });
// }


export default function setupSocket(io) {
  // Store active users in memory: { socketId: { documentId, user: { name, color } } }
  const activeUsers = {};

  io.on('connection', (socket) => {
    socket.on('join-document', ({ documentId, user }) => {
      socket.join(documentId);
      
      // Store user info
      activeUsers[socket.id] = { 
        documentId, 
        user: { 
          id: user.id,
          name: user.name,
          // Generate a consistent color based on name
          color: stringToColor(user.name) 
        } 
      };

      // Emit updated user list to everyone in the room
      const roomUsers = getRoomUsers(documentId);
      io.to(documentId).emit('room-users', roomUsers);
    });

    socket.on('send-changes', (data) => {
      socket.to(data.documentId).emit('receive-changes', data.newContent);
    });

    socket.on('disconnect', () => {
      const session = activeUsers[socket.id];
      if (session) {
        const { documentId } = session;
        delete activeUsers[socket.id];
        
        // Notify room that user left
        const roomUsers = getRoomUsers(documentId);
        io.to(documentId).emit('room-users', roomUsers);
      }
    });
  });

  // Helper to filter users by room
  function getRoomUsers(documentId) {
    return Object.values(activeUsers)
      .filter(session => session.documentId === documentId)
      .map(session => session.user); // Return only user info
  }

  // Helper to generate nice avatar colors
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }
}
/**
 * Socket.io Handler
 * Manages real-time collaboration rooms.
 */
export default function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // 1. Join a specific document room
    socket.on('join-document', (documentId) => {
      socket.join(documentId);
      console.log(`User ${socket.id} joined document: ${documentId}`);
    });

    // 2. Handle incoming changes from a client
    socket.on('send-changes', (data) => {
      const { documentId, newContent } = data;
      
      // Broadcast changes to everyone ELSE in the room
      // socket.to(...) excludes the sender, preventing echo loops
      socket.to(documentId).emit('receive-changes', newContent);
    });

    // 3. Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

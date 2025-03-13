// Configuration et gestion des connexions Socket.io
const configureSocketIO = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected");
        
        // Join a room based on user role and ID
        socket.on("join", (userData) => {
            const { userId, role } = userData;
            console.log(`User ${userId} with role ${role} joined`);
            
            // Join user-specific room
            socket.join(userId);
            
            // Store user info in socket
            socket.userId = userId;
            socket.userRole = role;
        });
        
        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    return io;
};

module.exports = {
    configureSocketIO
};
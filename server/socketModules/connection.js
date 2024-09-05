module.exports = (io, socket) => {
    socket.on('connection', (io) => {
        io.emit('message', 'Client connected');
    });
};
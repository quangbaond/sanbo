const user = require('../models/user');

module.exports = (io, socket) => {
    socket.on('admin-transaction', (transaction) => {
        io.emit('admin-transaction', transaction);
    });

    socket.on('updateTransaction', async (transaction) => {
        console.log(transaction);
        const userData = await user.findById(transaction.userId);
        io.emit(`updateTransaction-${transaction.userId}`, transaction);
        io.emit(`updateBalance-${transaction.userId}`, userData.balance);
    });
}
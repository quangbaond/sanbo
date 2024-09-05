const room = require('../models/room');

const createRoom = async (req, res) => {
    const { name, profit } = req.body;
    const newRoom = await room.create({ name, profit });
    res.status(200).json({
        newRoom,
        message: 'Tạo phòng thành công'
    });
}

const getRoomActive = async (req, res) => {
    const roomData = await room.find({ status: 'active' });
    res.status(200).json({
        roomData,
        message: 'Lấy phòng thành công'
    });
}

module.exports = {
    createRoom,
    getRoomActive
}


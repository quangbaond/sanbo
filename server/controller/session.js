const session = require('../models/session');
const moment = require('moment');
module.exports = {
    getSessionBefore: async (req, res) => {
        const { room, symbolName, page, limit } = req.query;

        const options = {
            page: page || 1,
            limit: limit || 10,
            populate: 'binanceData'
        }
        const query = {
            typeTime: room,
            symbolName,
            timeStart: { $gte: moment().toDate() },
            status: 'active'
        }
        const data = await session.paginate(query, options);
        res.status(200).json({
            status: true,
            message: 'Get session before success',
            data: data
        });
    }
}
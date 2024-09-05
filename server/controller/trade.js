const trade = require('../models/trade');

const getTradeData = async (req, res) => {
    const tradeData = await trade.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
            path: 'session',
            populate: {
                path: 'room'
            }
        });
    res.status(200).json({
        tradeData: tradeData.reverse()
    });
}

const getTradeListData = async (req, res) => {
    const { page, limit } = req.query;

    const options = {
        page: page || 1,
        limit: limit || 10,
        sort: { createdAt: -1 },
        populate: {
            path: 'session',
            populate: {
                path: 'room'
            }
        },
        populate: {
            path: 'user',
        }
    }

    const query = {
        isBot: false
    }

    const tradeData = await trade.paginate(query, options);

    res.status(200).json({
        tradeData: tradeData
    });
}
module.exports = {
    getTradeData,
    getTradeListData
}
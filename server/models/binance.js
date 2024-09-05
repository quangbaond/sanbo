const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const binanceSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true,
        default: Date.now
    },

    symbolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    symbolName: {
        type: String,
        required: true
    },

    open: {
        type: Number,
        required: true
    },

    high: {
        type: Number,
        required: true
    },

    low: {
        type: Number,
        required: true
    },

    close: {
        type: Number,
        required: true
    },

    volume: {
        type: Number,
        required: true
    },

    closeTime: {
        type: Date,
        required: true
    },
    forceResult: {
        type: Number,
        required: false
    }

}, {
    collection: 'binance',
    timestamps: true,
    virtuals: true, toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

binanceSchema.plugin(mongoosePaginate);

binanceSchema.virtual('symbol', {
    ref: 'Symbol',
    localField: 'symbolId',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Binance', binanceSchema);

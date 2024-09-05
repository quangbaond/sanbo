const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room',
        required: true
    },
    symbolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    symbolName: {
        type: String,
        required: true
    },
    timeStart: {
        type: Date,
        required: true,
        default: Date.now
    },
    timeEnd: {
        type: Date,
        required: true
    },
    binanceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'done', 'cancel'],
        default: 'active'
    },
    typeTime: {
        type: Number,
        required: true
    }
}, { collection: 'session', virtuals: true, toJSON: { virtuals: true }, timestamps: true });

sessionSchema.plugin(mongoosePaginate);

sessionSchema.virtual('room', {
    ref: 'room',
    localField: 'roomId',
    foreignField: '_id',
    justOne: true
});

sessionSchema.virtual('binanceData', {
    ref: 'Binance',
    localField: 'binanceId',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('session', sessionSchema);

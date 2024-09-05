const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'session',
        required: true
    },
    time: {
        type: Date,
        required: true,
        default: Date.now
    },
    symbolName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    isBot: {
        type: Boolean,
        default: false
    }
}, { collection: 'trade', virtuals: true, toJSON: { virtuals: true }, timestamps: true });

tradeSchema.plugin(mongoosePaginate);

tradeSchema.virtual('session', {
    ref: 'session',
    localField: 'sessionId',
    foreignField: '_id',
    justOne: true
})

tradeSchema.virtual('user', {
    ref: 'users',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
})

module.exports = mongoose.model('trade', tradeSchema);


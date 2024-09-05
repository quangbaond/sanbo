const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    bankId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    type: {
        type: String,
        required: true,
        enum: ['deposit', 'withdraw', 'transfer'],
        default: 'deposit'
    }
}, { collection: 'transaction', virtuals: true, toJSON: { virtuals: true }, timestamps: true });

transactionSchema.plugin(mongoosePaginate);

transactionSchema.virtual('user', {
    ref: 'users',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

transactionSchema.virtual('bank', {
    ref: 'bank',
    localField: 'bankId',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('transaction', transactionSchema);

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const symbolSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    base: {
        type: Number,
        required: true
    },
    min: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        required: true
    },
    change: {
        type: Number,
        required: true
    },
    changeMax: {
        type: Number,
        required: true
    },
    changePercent: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    },

}, {
    collection: 'symbol',
    timestamps: true,
    virtuals: true, toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

symbolSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Symbol', symbolSchema);
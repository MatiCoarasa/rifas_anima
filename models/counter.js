const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    nro: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Counter', counterSchema);
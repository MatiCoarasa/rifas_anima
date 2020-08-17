const mongoose = require('mongoose');

const rifaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    nro_rifa: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Rifa', rifaSchema);
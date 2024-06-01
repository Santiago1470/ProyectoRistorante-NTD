const mongoose = require('mongoose');
const platosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: false,
    },
    precio: {
        type: Number,
        required: false
    },
    categoria: {
        type: String    
    },
    ingredientes: {
        type: [String],
        required: true
    },
    imagen: {
        type: String,
        required: false
    }

})

module.exports = mongoose.model('Platos', platosSchema);
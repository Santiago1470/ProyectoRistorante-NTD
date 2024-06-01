const mongoose = require('mongoose');
const categoriasSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    platos: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Platos' }],
    }
})

module.exports = mongoose.model('Categorias', categoriasSchema);
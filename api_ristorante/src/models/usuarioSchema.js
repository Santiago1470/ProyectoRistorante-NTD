const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const usuarioSchema = mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['administrador', 'cliente'],
        default: 'cliente',
        required: true
    },
    carrito:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pedidos' }],
        max: 1,
        default: []
    },
    reservas:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservas' }],
        default: []
    }
})
usuarioSchema.methods.encryptClave = async (clave) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(clave, salt);
}
module.exports = mongoose.model('Usuario', usuarioSchema);
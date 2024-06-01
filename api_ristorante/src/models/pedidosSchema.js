const mongoose = require('mongoose');
//Se crea un esquema para tener los pedidos, es decir los pedidos que cada persona tenga y su estado
//Asi para poder utilizar un GET(Ver platos), POST(Pedir comida) y PUT/DELETE(Gestionar Pedidos)
const pedidosSquema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    platos: {
        type: [{
            plato: {
                type: { type: mongoose.Schema.Types.ObjectId, ref: 'Platos' },
            },
            estado: {
                type: String,
                enum: ['Plato en preparación', 'Plato en camino', 'Plato entregado'],
                required: true
            }
        }]
    }
})
module.exports = mongoose.model('Pedidos', pedidosSquema)
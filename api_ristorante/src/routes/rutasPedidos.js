const express = require('express');
const router = express.Router();
const pedidos = require('../models/pedidosSchema');
const usuarios = require('../models/usuarioSchema');
const platosSchema = require('../models/platosSchema');
const verifyToken = require('./tokenValidacion');
const admin = require('./administrador');


router.get('/carrito/mis-pedidos', verifyToken, async (req, res) => {
    const usuarioId = req.user;
    try {
        const misPedidos = await pedidos.find({ usuario: usuarioId._id }).populate('platos').exec();
        res.json(misPedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos del usuario' });
    }
});

// Obtener todos los pedidos (para administradores)
router.get('/carrito', admin, async (req, res) => {
    try {
        const todosPedidos = await pedidos.find().populate('platos').exec();
        if (todosPedidos.length === 0) {
            res.status(404).json({ error: 'No hay pedidos encontrados' });
        } else {
            res.json(todosPedidos);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener todos los pedidos' });
    }
});


// Agregar un pedido al carrito del usuario
router.post('/carrito/agregar', verifyToken, async (req, res) => {
    const {id} = req.user;
    const { platos } = req.body;
    
    try {
        const user = await usuarios.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }
        const platosIds = platos.map(plato => plato.plato);
        const platosExistenCount = await platosSchema.countDocuments({ _id: { $in: platosIds } });
        if (platosExistenCount !== platosIds.length) {
            return res.status(404).json({ error: 'Algunos platos no existen' });
        }
        const pedido = pedidos({
            usuario: id,
            platos: platos.map(({ plato, estado }) => ({ plato, estado }))
        });
        await pedido.save();
        user.carrito.push(pedido._id);
        await user.save();
        res.status(200).json({ message: 'Pedido agregado al carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el pedido al carrito' });
    }
});

// Eliminar un plato del carrito del usuario
router.delete('/carrito/:pedidoId/plato/:platoId', verifyToken, async (req, res) => {
    const pedidoId = req.params.pedidoId;
    const platoId = req.params.platoId;
    try {
        const pedido = await pedidos.findById(pedidoId);
        if (!pedido) {
            return res.status(404).json({ error: 'El pedido no existe' });
        }
        const platoIndex = pedido.platos.findIndex(plato => plato.plato.equals(platoId));
        if (platoIndex !== -1) {
            pedido.platos.splice(platoIndex, 1);
            await pedido.save();
            res.json(pedido);
        } else {
            res.status(404).json({ message: "El plato no se encontró en el carrito" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el plato del carrito' });
    }
});


// Actualizar el estado de un plato en el carrito del usuario
router.put('/carrito/:pedidoId/plato/:platoId', verifyToken, async (req, res) => {
    const pedidoId = req.params.pedidoId;
    const platoId = req.params.platoId;
    const nuevoEstado = req.body.estado;
    try {
        const pedido = await pedidos.findById(pedidoId);
        if (!pedido) {
            return res.status(404).json({ error: 'El pedido no existe' });
        }
        const plato = pedido.platos.find(plato => plato.plato.equals(platoId));
        if (plato) {
            plato.estado = nuevoEstado;
            await pedido.save();
            res.json(pedido);
        } else {
            res.status(404).json({ message: "El plato no se encontró en el carrito" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del plato en el carrito' });
    }
});
module.exports = router;
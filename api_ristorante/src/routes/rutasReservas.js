const express = require('express');
const router = express.Router();
const reservas = require('../models/reservasSchema');
const verifyToken = require('./tokenValidacion');
const usuarios = require('../models/usuarioSchema');

router.post("/reservas", verifyToken, async (req, res) => {
    const {id} = req.user;
    const reserva = new reservas(req.body);
    
    try {
        const usuario = await usuarios.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }
        usuario.reservas.push(reserva._id);
        await usuario.save();
        const ReservaNueva = await reserva.save();
        res.json(ReservaNueva);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.get("/reservas/:userId", verifyToken, async (req, res) => {
    const {id} = req.user;
    try {
        const reservasUsuario = await reservas.find({ usuario: id }).populate('usuario');
        res.json(reservasUsuario);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.get("/reservas", (req, res) => {
    reservas.find()
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error }));
});

router.get("/reservas/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    reservas.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error }));
});

router.put("/reservas/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const { nombreCliente, numeroPersonas, mesa, fecha, hora, estado } = req.body;
    reservas.updateOne({ _id: id }, {
        $set: { nombreCliente, numeroPersonas, mesa, fecha, hora, estado }
    }).then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error }));
});

router.delete("/reservas/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    reservas.findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error }));
});

module.exports = router;
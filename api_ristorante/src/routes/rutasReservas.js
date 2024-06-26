const express = require('express');
const router = express.Router();
const reservas = require('../models/reservasSchema');
const verifyToken = require('./tokenValidacion');
const usuarios = require('../models/usuarioSchema');

router.post("/reservas", verifyToken, async (req, res) => {
    const {_id} = req.user;
    const reserva = new reservas(req.body);
    
    try {
        const usuario = await usuarios.findById(_id);
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
    const {userId} = req.params;
    console.log("aqui")
    try {
        const reservasUsuario = await reservas.find({ nombreCliente: userId }).populate('nombreCliente');
        res.json(reservasUsuario);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error });
    }
});

router.get("/reservas", verifyToken, async (req, res) => {
    // console.log("en todas las reservas")
    // reservas.find()
    //     .then((data) => res.json(data))
    //     .catch((error) => res.status(500).json({ message: error }));
    reservas.find()
    .populate('nombreCliente') // Esto realiza la unión entre la reserva y el cliente
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

router.get("/reservas/unidad/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    console.log("HOLA!!")
    // reservas.findById(id)
    //     .then((data) => res.json(data))
    //     .catch((error) => res.status(500).json({ message: error }));

    reservas.findById(id)
    .populate('nombreCliente') // Popula los datos del cliente en la reserva
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));

    // const {id} = req.params;
    // const {_id} = req.user;
    // console.log("HOLA")
    // try {
    //     const reservasUsuario = await reservas.find({ _id: id, nombreCliente: _id}).populate('nombreCliente');
    //     res.json(reservasUsuario);
    // } catch (error) {
    //     console.error(error)
    //     res.status(500).json({ message: error });
    // }
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
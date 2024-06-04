const express = require('express');
const router = express.Router();
const usuarios = require('../models/usuarioSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('./administrador');

router.post("/signup", async (req, res) => {
    const { usuario, nombre, correo, clave, rol, carrito } = req.body;
    const user = new usuarios({
        usuario: usuario,
        nombre: nombre,
        correo: correo,
        clave: clave,
        rol: rol,
        carrito: carrito
    });
    user.clave = await user.encryptClave(user.clave);
    await user.save();
    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.SECRET);
    res.json({
        auth: true,
        token,
    });
});
router.post("/login", async (req, res) => {
    const { error } = usuarios.validate(req.body.correo, req.body.clave);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const user = await usuarios.findOne({ usuario: req.body.usuario });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    const validPassword = await bcrypt.compare(req.body.clave, user.clave);
    const token = jwt.sign({ _id: user._id, rol: user.rol }, process.env.SECRET)
    if (!validPassword)
        return res.status(400).json({ error: "Clave no válida" });
    res.json({
        token: token,
        error: null,
        data: "Bienvenido(a)",
    });
});

router.get('/getUsers'/*, admin*/, async (req, res) => {
    try {
        const usuario = await usuarios.find();

        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
module.exports = router;
const express = require('express');
const router = express.Router();
const usuarios = require('../models/usuarioSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/signup", async (req, res) => {
    const { usuario, nombre, correoElectronico, contraseña, rol, carrito } = req.body;
    const user = new usuarios({
        usuario: usuario,
        nombre: nombre,
        correoElectronico: correoElectronico,
        contraseña: contraseña,
        rol: rol,
        carrito: carrito
    });
    user.contraseña = await user.encryptClave(user.contraseña);
    await user.save();
    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.SECRET);
    res.json({
        auth: true,
        token,
    });
});
router.post("/login", async (req, res) => {
    const { error } = usuarios.validate(req.body.correoElectronico, req.body.contraseña);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const user = await usuarios.findOne({ usuario: req.body.usuario });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    const validPassword = await bcrypt.compare(req.body.contraseña, user.contraseña);
    const token = jwt.sign({ _id: user._id, rol: user.rol }, process.env.SECRET)
    if (!validPassword)
        return res.status(400).json({ error: "Clave no válida" });
    res.json({
        token: token,
        error: null,
        data: "Bienvenido(a)",
    });
});

router.get('/getUsers', async (req, res) => {
    try {
        const usuario = await usuarios.find();

        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
module.exports = router;
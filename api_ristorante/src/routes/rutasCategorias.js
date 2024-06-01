const express = require('express');
const router = express.Router();
const categorias = require('../models/categoriasSchema');
const admin = require('./administrador');
const token = require('./tokenValidacion')

router.post("/categorias",  (req, res) => {
    const categoria = categorias(req.body);
    categoria.save()
        .then((data) => res.json(data))
        .catch((error) => {
            res.status(500).json({ error: "Error al guardar el categoria en la base de datos" });
        });
});

router.get("/categorias", (req, res) => {
    categorias.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/categorias/:id", (req, res) => {
    const { id } = req.params;
    categorias.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.put("/categorias/:id", admin, (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, ingredientes, imagen } = req.body;
    categorias.updateOne({ _id: id }, {
        $set: { nombre, descripcion, precio, categoria, ingredientes, imagen }
    }).then((data) => res.json(data))
        .catch((data) => res.json({ message: error }));
});

router.delete("/categorias/:id", admin, (req, res) => {
    const { id } = req.params;
    categorias.findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
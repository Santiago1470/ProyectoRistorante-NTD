const express = require('express');
const router = express.Router();
const platos = require('../models/platosSchema');
const admin = require('./administrador');
const token = require('./tokenValidacion')

router.post("/platos", admin, async(req, res) => {
    const plato = platos(req.body);
    plato.save()
        .then((data) => res.json(data))
        .catch((error) => {
            res.status(500).json({ error: "Error al guardar el plato en la base de datos" });
        });
});

router.get("/platos", async(req, res) => {
    platos.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/platos/:id", async (req, res) => {
    const { id } = req.params;
    platos.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.put("/platos/:id", admin, async(req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, ingredientes, imagen } = req.body;
    platos.updateOne({ _id: id }, {
        $set: { nombre, descripcion, precio, categoria, ingredientes, imagen }
    }).then((data) => res.json(data))
        .catch((data) => res.json({ message: error }));
});

router.delete("/platos/:id", admin, async(req, res) => {
    const { id } = req.params;
    platos.findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get('/platosXCategorias/:categoria', async(req, res) => {

    console.log('platosXCategorias consulta ' 
        + req.params.categoria
    ) 
    // Categorías específicas a buscar
    const categoriaABuscar = req.params.categoria;

    // Consulta MongoDB para buscar productos que tengan las categorías mencionadas
    platos.find({ categoria: categoriaABuscar })
        .then(result => {
            // Resultado de la consulta
            console.log('Resultados:', result);
            // Envío de los resultados al cliente
            res.send(result);
        })
        .catch(err => {
            console.error('Error al buscar categorias:', err);
            // Manejo de error
            res.status(500).send('Error interno del servidor');
        });
});

module.exports = router;
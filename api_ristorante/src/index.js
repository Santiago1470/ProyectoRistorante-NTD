const express = require('express');
const app = express();
const PORT = 3000;
const parser = require('body-parser');
const mongoose = require('mongoose');
// Routers
const platosRoutes = require('./routes/rutasPlatos');
const reservasRoutes = require('./routes/rutasReservas');
const pedidosRoutes = require('./routes/rutasPedidos');
const autenticacion = require('./routes/autenticacion');
const categoriasRoutes = require('./routes/rutasCategorias');

require("dotenv").config();
app.use(parser.urlencoded({extended: false}));  // permite leer los datos que vienen en la petición
app.use(parser.json()); // transforma los datos a formato JSON
// Gestión de las rutas usando el middleware
app.use("/Ciprianis", platosRoutes);
app.use("/Ciprianis", reservasRoutes);
app.use("/Ciprianis", pedidosRoutes);
app.use("/Ciprianis", autenticacion)
app.use("/Ciprianis", categoriasRoutes)
app.use(express.json());

// Conexión a base de datos
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Conexión exitosa."))
    .catch((error)=> console.log(error));

// Conexión al puerto
app.listen(PORT, () => {
    console.log(`La aplicación está corriendo en el puerto ${PORT}`)
})
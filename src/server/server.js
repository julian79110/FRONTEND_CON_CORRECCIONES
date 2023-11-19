const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const mongoose = require('mongoose');

const app = express();
const puerto = process.env.EXPRESS_PORT || 8888;

// Configurar CORS
app.use(cors());

// Conexión a MongoDB
const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/citas_medicas';
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado a MongoDB'.bgWhite.magenta))
    .catch(error => console.error('Error al conectar con MongoDB:', error.message));

// Middleware para aceptar datos JSON
app.use(express.json());

// Rutas
const usersRoutes = require('./routes/userRoutes');
app.use('/api/v1/devcamps/users', usersRoutes);
const citasRoutes = require('./routes/citasRoutes');
app.use('/api/v1/devcamps/citas', citasRoutes);

// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`El servidor se ha iniciado en el puerto ${puerto}`.bgWhite.magenta);
});
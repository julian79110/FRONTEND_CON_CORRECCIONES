const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// Habilitar CORS
app.use(cors());

app.use(express.json());

app.post('/api/usuarios', (req, res) => {
    try {
        const nuevoUsuario = req.body;

        res.json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
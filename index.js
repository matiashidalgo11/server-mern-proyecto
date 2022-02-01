const express = require('express');
const conectarDB = require('./config/db.js');
const cors = require('cors');

// crear el servidor
const app = express();

//Conectar a la base de datos
conectarDB();

//Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({extend: true}));

// se asigna el puerto
const port = process.env.port || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//Definir la pagina principal
app.get('/', (req, res) => {
    res.send('Hola Mundo');
})

//arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})

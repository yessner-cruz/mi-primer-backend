const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint inicial
app.get('/api/saludo', (req, res) => {
  res.json({
    mensaje: "Hola desde el backend",
    estudiante: "Yessner Yoel Cruz Morales",
    colaborador: "Jose Lumbi",
    colaborador2: "Steven Barboza",
    colaborador3: "Enoc Noguera",
    universidad: "UNCSM",
    unidad: "Unidad II"
  });
});

// Ruta con query string
app.get('/search', (req, res) => {
  const termino = req.query.termino || 'No especificado';
  const categoria = req.query.categoria || 'No especificada';

  res.json({
    termino,
    categoria,
    mensaje: 'Búsqueda realizada correctamente'
  });
});

// Ruta con parámetro
app.get('/users/:id', (req, res) => {
  const id = req.params.id;

  res.json({
    id,
    mensaje: `Mostrando usuario con ID ${id}`
  });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
});
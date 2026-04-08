const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir archivos de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint
app.get('/api/saludo', (req, res) => {
  res.json({
    mensaje: "Hola desde el backend",
    estudiante: "Yessner Yoel Cruz Morales",
    colaborador: "Jose Lumbi", // 👈 agregado
    colaborador2: "Steven Barboza", // 👈 agregado
    universidad: "UNCSM",
    unidad: "Unidad II"
  });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
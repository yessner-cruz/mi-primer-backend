const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARES GLOBALES
// ===============================

// Logger: registra fecha, método y ruta
app.use((req, res, next) => {
  const tiempo = new Date().toISOString();
  console.log(`[LOG] ${tiempo} | Método: ${req.method} | URL: ${req.url}`);
  next();
});

// Middleware built-in para leer JSON
app.use(express.json());

// Body-parser para JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// ===============================
// MIDDLEWARE LOCAL DE SEGURIDAD
// ===============================

const validarAcceso = (req, res, next) => {
  const token = req.query.token;

  if (token === 'admin123') {
    next(); // permite continuar a la ruta protegida
  } else {
    res
      .status(401)
      .send('<h1>401 No Autorizado</h1><p>Se requiere un token válido para acceder.</p>');
  }
};

// ===============================
// RUTAS
// ===============================

// Endpoint inicial
app.get('/api/saludo', (req, res) => {
  res.json({
    mensaje: 'Hola desde el backend',
    estudiante: 'Yessner Yoel Cruz Morales',
    colaborador: 'Jose Lumbi',
    colaborador2: 'Steven Barboza',
    colaborador3: 'Enoc Noguera',
    universidad: 'UNCSM',
    unidad: 'Unidad II'
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

// Ruta protegida con middleware local
app.get('/api/recurso', validarAcceso, (req, res) => {
  res.json({
    estado: 'Conexión exitosa',
    data: 'Este es un mensaje protegido desde el backend',
    timestamp: new Date()
  });
});

// ===============================
// MIDDLEWARE FINAL 404
// ===============================

app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada</h1><p>La ruta solicitada no existe en este servidor.</p>');
});

// ===============================
// ENCENDER SERVIDOR
// ===============================

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
});
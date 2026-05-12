const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const {
  probarConexion,
  validarLlaveAcceso,
  registrarAuditoria
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARES GLOBALES
// ===============================

// Logger: registra fecha, método y ruta en consola
app.use((req, res, next) => {
  const tiempo = new Date().toISOString();
  console.log(`[AUDITORÍA] ${tiempo} | Método: ${req.method} | URL: ${req.url}`);
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

// Este middleware valida el token consultando SQL Server
const validarAcceso = async (req, res, next) => {
  try {
    const token = req.query.token;
    const accesoValido = await validarLlaveAcceso(token);

    if (accesoValido) {
      await registrarAuditoria({
        ruta: req.originalUrl,
        metodo: req.method,
        tokenRecibido: token,
        resultado: 'PERMITIDO',
        ip: req.ip
      });

      return next();
    }

    await registrarAuditoria({
      ruta: req.originalUrl,
      metodo: req.method,
      tokenRecibido: token,
      resultado: 'DENEGADO',
      ip: req.ip
    });

    return res
      .status(401)
      .send('<h1>401 No Autorizado</h1><p>Se requiere un token válido registrado en la base de datos.</p>');

  } catch (error) {
    next(error);
  }
};

// ===============================
// RUTAS
// ===============================

// Endpoint inicial protegido con llave desde SQL Server
app.get('/api/saludo', async (req, res, next) => {
  try {
    const llave = req.query.llave;
    const accesoValido = await validarLlaveAcceso(llave);

    if (!accesoValido) {
      await registrarAuditoria({
        ruta: req.originalUrl,
        metodo: req.method,
        tokenRecibido: llave,
        resultado: 'DENEGADO',
        ip: req.ip
      });

      return res
        .status(401)
        .send('<h1>401 - No autorizado</h1><p>Se requiere una llave válida registrada en la base de datos.</p>');
    }

    await registrarAuditoria({
      ruta: req.originalUrl,
      metodo: req.method,
      tokenRecibido: llave,
      resultado: 'PERMITIDO',
      ip: req.ip
    });

    console.log('Acceso concedido desde SQL Server ✅');

    res.json({
      mensaje: 'Hola desde el backend',
      mensaje2: '🚀 Acceso autorizado desde SQL Server',
      estudiante: 'Yessner Yoel Cruz Morales',
      colaborador: 'Jose Lumbi',
      colaborador2: 'Steven Barboza',
      colaborador3: 'Enoc Noguera',
      colaborador4: 'Amilkar Solorzano',
      universidad: 'UNCSM',
      unidad: 'Unidad II'
    });

  } catch (error) {
    next(error);
  }
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

// Ruta protegida con middleware local y token desde SQL Server
app.get('/api/recurso', validarAcceso, (req, res) => {
  res.json({
    estado: 'Conexión exitosa',
    data: 'Este es un mensaje protegido desde el backend usando SQL Server',
    timestamp: new Date()
  });
});

// Ruta para probar error 500
app.get('/api/error', (req, res) => {
  throw new Error('Error forzado de prueba');
});

// ===============================
// MIDDLEWARE FINAL 404
// ===============================

app.use((req, res) => {
  res
    .status(404)
    .send('<h1>404 - Página no encontrada</h1><p>La ruta solicitada no existe en este servidor.</p>');
});

// ===============================
// MIDDLEWARE ERROR 500
// ===============================

app.use((err, req, res, next) => {
  console.error('[ERROR 500]', err.stack);

  res.status(500).send(`
    <h1>500 - Error interno del servidor</h1>
    <p>Ocurrió un fallo inesperado.</p>
  `);
});

// ===============================
// ENCENDER SERVIDOR
// ===============================

async function iniciarServidor() {
  try {
    await probarConexion();

    app.listen(PORT, () => {
      console.log(`Servidor: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('No se pudo iniciar el servidor por error de base de datos.');
    console.error(error.message);
    process.exit(1);
  }
}

iniciarServidor();
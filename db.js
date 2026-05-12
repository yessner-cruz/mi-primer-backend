const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

// ===============================
// CONFIGURACIÓN DE SQL SERVER
// ===============================

const connectionString = [
  `Driver={${process.env.DB_DRIVER || 'ODBC Driver 17 for SQL Server'}}`,
  `Server=${process.env.DB_SERVER || 'localhost'}`,
  `Database=${process.env.DB_DATABASE || 'DB_BACKEND_GUIA6'}`,
  'Trusted_Connection=Yes',
  'TrustServerCertificate=Yes'
].join(';') + ';';

const dbConfig = {
  connectionString
};

let poolPromise;

// ===============================
// CONEXIÓN A SQL SERVER
// ===============================

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(dbConfig)
      .connect()
      .then((pool) => {
        console.log('Conexión exitosa a SQL Server ✅');
        return pool;
      })
      .catch((error) => {
        console.error('Error al conectar a SQL Server:', error.message);
        throw error;
      });
  }

  return poolPromise;
}

// ===============================
// PRUEBA DE CONEXIÓN
// ===============================

async function probarConexion() {
  const pool = await getPool();

  const resultado = await pool.request().query('SELECT GETDATE() AS fechaServidor');

  console.log('Fecha del servidor SQL:', resultado.recordset[0].fechaServidor);

  return resultado.recordset[0];
}

// ===============================
// VALIDAR LLAVE O TOKEN DESDE BD
// ===============================

async function validarLlaveAcceso(tokenLlave) {
  if (!tokenLlave) {
    return false;
  }

  const pool = await getPool();

  const resultado = await pool.request()
    .input('token_llave', sql.NVarChar(100), tokenLlave)
    .query(`
      SELECT TOP 1 
        id,
        usuario_asignado,
        token_llave,
        activo
      FROM dbo.llaves_acceso
      WHERE token_llave = @token_llave
      AND activo = 1
    `);

  return resultado.recordset.length > 0;
}

// ===============================
// REGISTRAR AUDITORÍA EN BD
// ===============================

async function registrarAuditoria({ ruta, metodo, tokenRecibido, resultado, ip }) {
  const pool = await getPool();

  await pool.request()
    .input('ruta', sql.NVarChar(200), ruta)
    .input('metodo', sql.NVarChar(20), metodo)
    .input('token_recibido', sql.NVarChar(100), tokenRecibido || null)
    .input('resultado', sql.NVarChar(50), resultado)
    .input('ip', sql.NVarChar(100), ip || null)
    .query(`
      INSERT INTO dbo.auditoria_acceso 
      (ruta, metodo, token_recibido, resultado, ip)
      VALUES 
      (@ruta, @metodo, @token_recibido, @resultado, @ip)
    `);
}

module.exports = {
  sql,
  getPool,
  probarConexion,
  validarLlaveAcceso,
  registrarAuditoria
};
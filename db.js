// ===============================
// CONEXIÓN A BASE DE DATOS CON PRISMA
// GUÍA 7 - Prisma ORM + SQL Server
// ===============================

const { PrismaClient } = require('@prisma/client');

// Se crea una instancia del cliente Prisma
const prisma = new PrismaClient();

// ===============================
// PROBAR CONEXIÓN
// ===============================

async function probarConexion() {
  try {
    const resultado = await prisma.$queryRaw`
      SELECT SYSDATETIME() AS fechaServidor
    `;

    console.log('Conexión exitosa a SQL Server con Prisma ✅');
    console.log('Fecha del servidor SQL:', resultado[0].fechaServidor);

    return true;
  } catch (error) {
    console.error('Error al conectar con SQL Server usando Prisma:', error.message);
    throw error;
  }
}

// ===============================
// VALIDAR LLAVE O TOKEN
// ===============================

async function validarLlaveAcceso(tokenLlave) {
  try {
    if (!tokenLlave) {
      return null;
    }

    const acceso = await prisma.acceso.findFirst({
      where: {
        tokenLlave: tokenLlave,
        activo: true
      }
    });

    return acceso;
  } catch (error) {
    console.error('Error al validar llave con Prisma:', error.message);
    throw error;
  }
}

// ===============================
// REGISTRAR AUDITORÍA
// ===============================

async function registrarAuditoria({ ruta, metodo, tokenRecibido, resultado, ip }) {
  try {
    await prisma.auditoriaAcceso.create({
      data: {
        ruta: ruta,
        metodo: metodo,
        tokenRecibido: tokenRecibido || null,
        resultado: resultado,
        ip: ip || null
      }
    });
  } catch (error) {
    console.error('Error al registrar auditoría con Prisma:', error.message);
    throw error;
  }
}

// ===============================
// EXPORTAR FUNCIONES
// ===============================

module.exports = {
  prisma,
  probarConexion,
  validarLlaveAcceso,
  registrarAuditoria
};
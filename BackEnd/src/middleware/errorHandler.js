class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function notFound(req, res) {
  res.status(404).json({ error: `Ruta ${req.method} ${req.originalUrl} no encontrada.` });
}

function errorHandler(err, _req, res, _next) {
  const dbErrors = ['ER_NO_SUCH_TABLE', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'ECONNREFUSED', 'ETIMEDOUT'];
  const status =
    err.status || (err.type === 'entity.parse.failed' ? 400 : dbErrors.includes(err.code) ? 503 : 500);
  const message =
    status === 400
      ? 'El cuerpo de la petición no es un JSON válido.'
      : status === 503
      ? 'La base de datos no está disponible. Revisa MySQL y la configuración de .env.'
      : err.message || 'Error interno del servidor.';

  if (status >= 500) {
    console.error('[CryptoDiego API]', err.message);
  }

  res.status(status).json({ error: message });
}

module.exports = { AppError, notFound, errorHandler };

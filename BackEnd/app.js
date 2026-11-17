const express = require('express');
const cors = require('cors');
const config = require('./src/config/config');
const { health } = require('./src/config/db');
const routes = require('./src/routes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const allowedOrigins = config.frontendUrl.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('Origen no permitido por CORS.'));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await health();
    res.json({ status: 'ok', database: 'connected', service: 'CryptoDiego API' });
  } catch {
    res.status(503).json({ status: 'degraded', database: 'disconnected', service: 'CryptoDiego API' });
  }
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`CryptoDiego API corriendo en http://localhost:${config.port}`);
  });
}

module.exports = app;

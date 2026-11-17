const { getPrices } = require('../services/coingecko.service');

async function getPricesController(_req, res, next) {
  try {
    const result = await getPrices();
    res.json({
      prices: result.data,
      cachedAt: result.cachedAt,
      source: result.source,
      stale: result.stale
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getPricesController };

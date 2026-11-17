require('dotenv').config();

const number = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = {
  port: number(process.env.PORT, 3001),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  jwtSecret: process.env.JWT_SECRET || 'cryptodiego-dev-secret-cambiar-en-produccion',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: number(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cryptodiego'
  },
  wallets: {
    BTC: process.env.WALLET_BTC || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ETH: process.env.WALLET_ETH || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    USDT: process.env.WALLET_USDT || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  },
  external: {
    coingeckoUrl:
      process.env.COINGECKO_URL || 'https://api.coingecko.com/api/v3/coins/markets',
    newsUrl:
      process.env.CRYPTOCOMPARE_NEWS_URL || 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN',
    timeoutMs: number(process.env.EXTERNAL_TIMEOUT_MS, 8000)
  },
  cache: {
    pricesTtlMs: number(process.env.PRICES_CACHE_TTL_MS, 10 * 60 * 1000),
    newsTtlMs: number(process.env.NEWS_CACHE_TTL_MS, 10 * 60 * 1000)
  },
  ollama: {
    url: (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, ''),
    model: process.env.OLLAMA_MODEL || 'gemma3',
    timeoutMs: number(process.env.OLLAMA_TIMEOUT_MS, 12000)
  }
};

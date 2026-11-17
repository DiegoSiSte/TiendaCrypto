const axios = require('axios');
const config = require('../config/config');
const cache = require('./cache.service');

const FALLBACK_PRICES = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', currentPrice: 67000, priceChange24h: 1.42, image: '' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', currentPrice: 3500, priceChange24h: 0.86, image: '' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', currentPrice: 1, priceChange24h: 0.01, image: '' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', currentPrice: 590, priceChange24h: -0.24, image: '' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', currentPrice: 145, priceChange24h: 3.18, image: '' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', currentPrice: 0.62, priceChange24h: -1.05, image: '' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USDC', currentPrice: 1, priceChange24h: 0, image: '' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', currentPrice: 0.45, priceChange24h: 0.77, image: '' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', currentPrice: 0.16, priceChange24h: -2.11, image: '' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', currentPrice: 32, priceChange24h: 2.34, image: '' }
];

function normalize(row) {
  return {
    id: row.id,
    symbol: String(row.symbol || '').toUpperCase(),
    name: row.name,
    currentPrice: Number(row.current_price),
    priceChange24h: Number(row.price_change_percentage_24h || 0),
    marketCap: Number(row.market_cap || 0),
    image: row.image || '',
    lastUpdated: row.last_updated || null
  };
}

async function fetchPrices() {
  const { data } = await axios.get(config.external.coingeckoUrl, {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h'
    },
    timeout: config.external.timeoutMs,
    headers: { 'User-Agent': 'CryptoDiego/1.0' }
  });

  if (!Array.isArray(data) || !data.length) {
    throw new Error('CoinGecko devolvió una respuesta vacía.');
  }
  return data.map(normalize);
}

async function getPrices() {
  try {
    return await cache.getOrSet('coingecko:top10', config.cache.pricesTtlMs, async () => ({
      data: await fetchPrices(),
      source: 'coingecko'
    }));
  } catch (error) {
    const cached = cache.peek('coingecko:top10');
    if (cached) return { ...cached, stale: true };
    return {
      data: FALLBACK_PRICES,
      cachedAt: null,
      source: 'fallback',
      stale: true
    };
  }
}

async function getUsdPrice(symbol) {
  const { data } = await getPrices();
  const upper = String(symbol).toUpperCase();
  return data.find((coin) => coin.symbol === upper)?.currentPrice || null;
}

module.exports = { getPrices, getUsdPrice, FALLBACK_PRICES };

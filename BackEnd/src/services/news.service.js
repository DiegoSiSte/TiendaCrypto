const axios = require('axios');
const config = require('../config/config');
const newsModel = require('../models/news.model');

const CACHE_KEY = 'crypto_news';
const SAMPLE_NEWS = [
  {
    id: 'local-1',
    title: 'CryptoDiego: guía para empezar con wallets sin perder la semilla',
    url: '#',
    source: 'CryptoDiego',
    published: null,
    body: 'Guarda tu frase de recuperación offline y haz una prueba de restauración.'
  },
  {
    id: 'local-2',
    title: 'Pagos con cripto: cómo verificar un hash de transacción',
    url: '#',
    source: 'CryptoDiego',
    published: null,
    body: 'Copia el hash desde tu wallet y pégalo en el checkout para marcar la orden como pagada.'
  }
];

function normalize(item) {
  return {
    id: String(item.id || item.guid || ''),
    title: item.title || '',
    url: item.url || item.link || '#',
    source: item.source_info?.name || item.source || 'CryptoCompare',
    published: item.published_on ? new Date(item.published_on * 1000).toISOString() : null,
    body: item.body || ''
  };
}

async function fetchNews() {
  const { data } = await axios.get(config.external.newsUrl, {
    timeout: config.external.timeoutMs,
    headers: { 'User-Agent': 'CryptoDiego/1.0' }
  });
  const items = data?.Data;
  if (!Array.isArray(items) || !items.length) {
    throw new Error('La API de noticias devolvió una respuesta vacía.');
  }
  return items.slice(0, 20).map(normalize);
}

async function readCache() {
  try {
    return await newsModel.get(CACHE_KEY);
  } catch {
    return null;
  }
}

async function writeCache(payload) {
  try {
    await newsModel.set(CACHE_KEY, payload);
  } catch {
    return;
  }
}

async function getNews() {
  const cached = await readCache();
  const freshEnough =
    cached && Date.now() - new Date(cached.fetchedAt).getTime() < config.cache.newsTtlMs;

  if (freshEnough) {
    return { news: cached.payload, cachedAt: cached.fetchedAt, source: 'cache', stale: false };
  }

  try {
    const news = await fetchNews();
    await writeCache(news);
    const now = new Date().toISOString();
    return { news, cachedAt: now, source: 'cryptocompare', stale: false };
  } catch (error) {
    if (cached) {
      return { news: cached.payload, cachedAt: cached.fetchedAt, source: 'cache', stale: true };
    }
    return { news: SAMPLE_NEWS, cachedAt: null, source: 'fallback', stale: true };
  }
}

module.exports = { getNews, SAMPLE_NEWS };

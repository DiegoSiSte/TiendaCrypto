const { query } = require('../config/db');

async function get(key) {
  const rows = await query('SELECT payload, fetched_at FROM news_cache WHERE cache_key = ? LIMIT 1', [key]);
  if (!rows[0]) return null;
  const payload = typeof rows[0].payload === 'string' ? JSON.parse(rows[0].payload) : rows[0].payload;
  return { payload, fetchedAt: rows[0].fetched_at };
}

async function set(key, payload) {
  await query(
    `INSERT INTO news_cache (cache_key, payload) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE payload = VALUES(payload), fetched_at = CURRENT_TIMESTAMP`,
    [key, JSON.stringify(payload)]
  );
}

module.exports = { get, set };

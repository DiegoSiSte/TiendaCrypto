const { query } = require('../config/db');

async function log({ userId = null, message, response, source }) {
  await query(
    'INSERT INTO chat_logs (user_id, message, response, source) VALUES (?, ?, ?, ?)',
    [userId, message, response, source]
  );
}

module.exports = { log };

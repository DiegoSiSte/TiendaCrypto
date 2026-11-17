const { query } = require('../config/db');

function toPayment(row) {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    currency: row.currency,
    amountCrypto: Number(row.amount_crypto),
    walletAddress: row.wallet_address,
    txHash: row.tx_hash,
    status: row.status,
    createdAt: row.created_at
  };
}

async function findByOrder(orderId) {
  const rows = await query('SELECT * FROM payments WHERE order_id = ? LIMIT 1', [orderId]);
  return toPayment(rows[0]);
}

async function create({ orderId, currency, amountCrypto, walletAddress, txHash }) {
  await query(
    `INSERT INTO payments (order_id, currency, amount_crypto, wallet_address, tx_hash, status)
     VALUES (?, ?, ?, ?, ?, 'confirmado')
     ON DUPLICATE KEY UPDATE currency = VALUES(currency), amount_crypto = VALUES(amount_crypto),
       wallet_address = VALUES(wallet_address), tx_hash = VALUES(tx_hash), status = 'confirmado'`,
    [orderId, currency, amountCrypto, walletAddress, txHash]
  );
  return findByOrder(orderId);
}

module.exports = { findByOrder, create, toPayment };

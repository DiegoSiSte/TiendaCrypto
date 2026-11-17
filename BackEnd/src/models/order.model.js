const { query, pool } = require('../config/db');

function toOrder(row) {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    subtotalUsd: Number(row.subtotal_usd),
    shippingUsd: Number(row.shipping_usd),
    totalUsd: Number(row.total_usd),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toItem(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: Number(row.quantity),
    unitPriceUsd: Number(row.unit_price_usd)
  };
}

async function findByIdForUser(id, userId) {
  const rows = await query('SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1', [id, userId]);
  return rows[0] ? toOrder(rows[0]) : null;
}

async function findByUser(userId) {
  const orders = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC', [userId]);
  if (!orders.length) return [];

  const ids = orders.map((order) => order.id);
  const placeholders = ids.map(() => '?').join(', ');
  const [items, payments] = await Promise.all([
    query(
      `SELECT oi.*, p.name AS product_name FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id IN (${placeholders}) ORDER BY oi.id ASC`,
      ids
    ),
    query(`SELECT * FROM payments WHERE order_id IN (${placeholders})`, ids)
  ]);

  return orders.map((order) => {
    const payment = payments.find((row) => row.order_id === order.id);
    return {
      ...toOrder(order),
      items: items.filter((item) => item.order_id === order.id).map(toItem),
      payment: payment
        ? {
            id: payment.id,
            currency: payment.currency,
            amountCrypto: Number(payment.amount_crypto),
            walletAddress: payment.wallet_address,
            txHash: payment.tx_hash,
            status: payment.status
          }
        : null
    };
  });
}

async function createWithItems(userId, items, totals) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      'INSERT INTO orders (user_id, status, subtotal_usd, shipping_usd, total_usd) VALUES (?, ?, ?, ?, ?)',
      [userId, 'pendiente', totals.subtotalUsd, totals.shippingUsd, totals.totalUsd]
    );
    const orderId = result.insertId;

    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price_usd) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.unitPriceUsd]
      );
    }

    await connection.commit();
    const [rows] = await connection.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
    return toOrder(rows[0]);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateStatus(id, status) {
  await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  const rows = await query('SELECT * FROM orders WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? toOrder(rows[0]) : null;
}

module.exports = { findByIdForUser, findByUser, createWithItems, updateStatus };

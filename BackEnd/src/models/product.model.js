const { query } = require('../config/db');

function toProduct(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name || null,
    categorySlug: row.category_slug || null,
    name: row.name,
    slug: row.slug,
    description: row.description,
    priceUsd: Number(row.price_usd),
    stock: Number(row.stock),
    imageUrl: row.image_url,
    badge: row.badge
  };
}

const select = `SELECT p.*, c.name AS category_name, c.slug AS category_slug
                FROM products p JOIN categories c ON c.id = p.category_id
                WHERE p.active = 1`;

async function list(filters = {}) {
  const params = [];
  let sql = select;

  if (filters.category) {
    sql += ' AND c.slug = ?';
    params.push(filters.category);
  }

  if (filters.search) {
    sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term);
  }

  sql += ' ORDER BY p.id ASC';

  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(Math.min(Number(filters.limit) || 50, 100));
  }

  const rows = await query(sql, params);
  return rows.map(toProduct);
}

async function findById(id) {
  const rows = await query(`${select} AND p.id = ? LIMIT 1`, [id]);
  return rows[0] ? toProduct(rows[0]) : null;
}

async function listByIds(ids) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(', ');
  const rows = await query(`${select} AND p.id IN (${placeholders})`, ids);
  return rows.map(toProduct);
}

async function listForContext() {
  const rows = await query(`${select} ORDER BY p.id ASC LIMIT 12`);
  return rows.map((row) => ({ name: row.name, priceUsd: Number(row.price_usd) }));
}

module.exports = { list, findById, listByIds, listForContext };

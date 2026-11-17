const { query } = require('../config/db');

function toService(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    longDescription: row.long_description,
    icon: row.icon,
    priceFrom: Number(row.price_from),
    duration: row.duration,
    featured: Boolean(row.featured)
  };
}

async function list() {
  const rows = await query(
    `SELECT id, name, slug, description, long_description, icon, price_from, duration, featured
     FROM services WHERE active = 1 ORDER BY featured DESC, id ASC`
  );
  return rows.map(toService);
}

async function listForContext() {
  const services = await list();
  return services.map((service) => ({
    name: service.name,
    description: service.description,
    priceFrom: service.priceFrom,
    duration: service.duration
  }));
}

module.exports = { list, listForContext };

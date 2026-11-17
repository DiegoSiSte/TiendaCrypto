const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');
const { AppError } = require('../middleware/errorHandler');

const round = (value) => Math.round(value * 100) / 100;

function normalizeItems(bodyItems) {
  if (!Array.isArray(bodyItems) || !bodyItems.length) {
    throw new AppError(400, 'El carrito está vacío. Agrega productos antes de crear la orden.');
  }

  const merged = new Map();
  for (const entry of bodyItems) {
    const productId = Number(entry.productId ?? entry.id);
    const quantity = Number(entry.quantity);
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new AppError(400, 'Hay un producto con identificador inválido.');
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new AppError(400, 'Las cantidades deben estar entre 1 y 99.');
    }
    merged.set(productId, (merged.get(productId) || 0) + quantity);
  }

  return Array.from(merged, ([productId, quantity]) => ({ productId, quantity }));
}

async function createOrder(req, res, next) {
  try {
    const requested = normalizeItems(req.body.items);
    const products = await productModel.listByIds(requested.map((item) => item.productId));
    const productMap = new Map(products.map((product) => [product.id, product]));

    const items = requested.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new AppError(400, `El producto ${item.productId} no está disponible.`);
      if (product.stock < item.quantity) {
        throw new AppError(400, `No hay stock suficiente de ${product.name}.`);
      }
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPriceUsd: product.priceUsd
      };
    });

    const shippingUsd = Math.max(0, Number(req.body.shippingUsd) || 0);
    const subtotalUsd = round(items.reduce((sum, item) => sum + item.unitPriceUsd * item.quantity, 0));
    const totals = {
      subtotalUsd,
      shippingUsd: round(shippingUsd),
      totalUsd: round(subtotalUsd + shippingUsd)
    };

    const order = await orderModel.createWithItems(req.user.id, items, totals);
    res.status(201).json({ order: { ...order, items } });
  } catch (error) {
    next(error);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await orderModel.findByUser(req.user.id);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

module.exports = { createOrder, getMyOrders };

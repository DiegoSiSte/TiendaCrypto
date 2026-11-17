const config = require('../config/config');
const orderModel = require('../models/order.model');
const paymentModel = require('../models/payment.model');
const { getUsdPrice } = require('../services/coingecko.service');
const { AppError } = require('../middleware/errorHandler');

async function createPayment(req, res, next) {
  try {
    const orderId = Number(req.params.orderId || req.body.orderId);
    const currency = String(req.body.currency || '').toUpperCase();
    const txHash = String(req.body.txHash || '').trim();

    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new AppError(400, 'Identificador de orden inválido.');
    }
    if (!Object.prototype.hasOwnProperty.call(config.wallets, currency)) {
      throw new AppError(400, 'Moneda no aceptada. Usa BTC, ETH o USDT.');
    }
    if (txHash.length < 10 || /\s/.test(txHash)) {
      throw new AppError(400, 'Pega un hash de transacción válido, sin espacios.');
    }

    const order = await orderModel.findByIdForUser(orderId, req.user.id);
    if (!order) throw new AppError(404, 'Orden no encontrada para este usuario.');

    const existing = await paymentModel.findByOrder(orderId);
    if (existing && order.status === 'pagada') {
      return res.json({ payment: existing, order, alreadyPaid: true });
    }
    if (order.status === 'cancelada') {
      throw new AppError(409, 'La orden está cancelada y no admite pagos.');
    }

    const usdPrice = await getUsdPrice(currency);
    if (!usdPrice) throw new AppError(503, 'No se pudo obtener el precio de la moneda.');

    const amountCrypto = Math.round((order.totalUsd / usdPrice) * 1e8) / 1e8;
    const payment = await paymentModel.create({
      orderId,
      currency,
      amountCrypto,
      walletAddress: config.wallets[currency],
      txHash
    });
    const paidOrder = await orderModel.updateStatus(orderId, 'pagada');

    return res.status(201).json({ payment, order: paidOrder, alreadyPaid: false });
  } catch (error) {
    next(error);
  }
}

async function getAddresses(_req, res) {
  res.json({ addresses: config.wallets });
}

async function getPaymentByOrder(req, res, next) {
  try {
    const orderId = Number(req.params.orderId);
    const order = await orderModel.findByIdForUser(orderId, req.user.id);
    if (!order) throw new AppError(404, 'Orden no encontrada para este usuario.');

    const payment = await paymentModel.findByOrder(orderId);
    if (!payment) throw new AppError(404, 'Esta orden todavía no tiene un pago registrado.');

    res.json({ payment, order });
  } catch (error) {
    next(error);
  }
}

module.exports = { createPayment, getPaymentByOrder, getAddresses };

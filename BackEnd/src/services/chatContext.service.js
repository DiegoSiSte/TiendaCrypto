const serviceModel = require('../models/service.model');
const productModel = require('../models/product.model');
const { getPrices } = require('./coingecko.service');

const FALLBACK_SERVICES = [
  'Asesoría cripto',
  'Compra y venta asistida',
  'Configuración de wallets',
  'Staking gestionado',
  'Auditoría de smart contracts'
];
const FALLBACK_PRODUCTS = [
  'Ledger Nano S Plus',
  'Trezor Model T',
  'CryptoDiego Hoodie',
  'Curso DeFi 101'
];

async function buildContext() {
  const [servicesResult, productsResult, pricesResult] = await Promise.allSettled([
    serviceModel.listForContext(),
    productModel.listForContext(),
    getPrices()
  ]);

  const services =
    servicesResult.status === 'fulfilled' && servicesResult.value.length
      ? servicesResult.value
      : FALLBACK_SERVICES.map((name) => ({ name, priceFrom: null }));
  const products =
    productsResult.status === 'fulfilled' && productsResult.value.length
      ? productsResult.value
      : FALLBACK_PRODUCTS.map((name) => ({ name }));
  const prices = pricesResult.status === 'fulfilled' ? pricesResult.value.data.slice(0, 5) : [];

  const lines = [
    'Plataforma: CryptoDiego.',
    'Servicios disponibles:',
    ...services.map((service) => `- ${service.name}${service.priceFrom ? ` (desde ${service.priceFrom} USD)` : ''}`),
    'Productos destacados de la tienda:',
    ...products.map((product) => `- ${product.name}${product.priceUsd ? ` (${product.priceUsd} USD)` : ''}`),
    'Monedas aceptadas: BTC, ETH y USDT.',
    'Pasos de pago: 1) elige moneda, 2) consulta el monto convertido con CoinGecko, 3) copia la dirección o escanea el QR, 4) envía la transacción y pega el tx_hash en el checkout, 5) la orden pasa a pagada.',
    'Precios de referencia (USD):',
    ...prices.map((coin) => `- ${coin.symbol}: ${coin.currentPrice}`),
    'Las noticias se obtienen de una API pública y se cachean 10 minutos.',
    'Historial de órdenes disponible para usuarios registrados.'
  ];

  return lines.join('\n');
}

module.exports = { buildContext };

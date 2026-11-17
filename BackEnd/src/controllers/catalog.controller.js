const serviceModel = require('../models/service.model');
const productModel = require('../models/product.model');

async function getServices(_req, res, next) {
  try {
    res.json({ services: await serviceModel.list() });
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const products = await productModel.list({
      category: req.query.category,
      search: req.query.search,
      limit: req.query.limit
    });
    res.json({ products });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    return res.json({ product });
  } catch (error) {
    next(error);
  }
}

module.exports = { getServices, getProducts, getProductById };

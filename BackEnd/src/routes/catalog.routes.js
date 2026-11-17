const express = require('express');
const { getServices, getProducts, getProductById } = require('../controllers/catalog.controller');

const router = express.Router();

router.get('/services', getServices);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

module.exports = router;

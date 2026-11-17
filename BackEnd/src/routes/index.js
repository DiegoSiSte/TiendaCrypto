const express = require('express');
const authRoutes = require('./auth.routes');
const catalogRoutes = require('./catalog.routes');
const orderRoutes = require('./order.routes');
const paymentRoutes = require('./payment.routes');
const miscRoutes = require('./misc.routes');

const router = express.Router();

router.use(authRoutes);
router.use(catalogRoutes);
router.use(orderRoutes);
router.use(paymentRoutes);
router.use(miscRoutes);

module.exports = router;

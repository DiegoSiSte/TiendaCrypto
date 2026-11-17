const express = require('express');
const { createOrder, getMyOrders } = require('../controllers/order.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/orders', auth, createOrder);
router.get('/orders/me', auth, getMyOrders);

module.exports = router;

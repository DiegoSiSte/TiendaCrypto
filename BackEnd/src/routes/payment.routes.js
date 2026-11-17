const express = require('express');
const { createPayment, getPaymentByOrder, getAddresses } = require('../controllers/payment.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/payments/addresses', getAddresses);
router.post('/payments', auth, createPayment);
router.get('/payments/:orderId', auth, getPaymentByOrder);

module.exports = router;

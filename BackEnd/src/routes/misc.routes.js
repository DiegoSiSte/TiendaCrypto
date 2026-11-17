const express = require('express');
const { getPricesController } = require('../controllers/price.controller');
const { getNewsController } = require('../controllers/news.controller');
const { postChat } = require('../controllers/chat.controller');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/prices', getPricesController);
router.get('/news', getNewsController);
router.post('/chat', optionalAuth, postChat);

module.exports = router;

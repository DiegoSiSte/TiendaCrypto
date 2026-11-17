const { getNews } = require('../services/news.service');

async function getNewsController(_req, res, next) {
  try {
    res.json(await getNews());
  } catch (error) {
    next(error);
  }
}

module.exports = { getNewsController };

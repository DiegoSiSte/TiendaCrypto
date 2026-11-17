const chatModel = require('../models/chat.model');
const { buildContext } = require('../services/chatContext.service');
const { ask } = require('../services/ollama.service');
const { AppError } = require('../middleware/errorHandler');

async function postChat(req, res, next) {
  try {
    const message = String(req.body.message || '').trim();
    if (!message || message.length > 2000) {
      throw new AppError(400, 'Escribe un mensaje de entre 1 y 2000 caracteres.');
    }

    const context = await buildContext();
    const result = await ask({
      message,
      context,
      history: req.body.history
    });

    try {
      await chatModel.log({
        userId: req.user?.id || null,
        message,
        response: result.text,
        source: result.source
      });
    } catch {
      return res.json({ reply: result.text, source: result.source, saved: false });
    }

    res.json({ reply: result.text, source: result.source, saved: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { postChat };

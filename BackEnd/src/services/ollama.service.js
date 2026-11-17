const axios = require('axios');
const config = require('../config/config');
const fallback = require('./chatFallback.service');

const SYSTEM_PROMPT =
  'Eres el asistente de CryptoDiego. Responde SOLO sobre la plataforma: servicios, tienda, pagos con cripto, noticias, cuentas y órdenes. Si la pregunta es de otro tema, responde que solo puedes ayudar con CryptoDiego. Responde en español, breve.';

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string')
    .slice(-10)
    .map((item) => ({ role: item.role, content: item.content.slice(0, 1000) }));
}

async function ask({ message, context, history = [] }) {
  try {
    const { data } = await axios.post(
      `${config.ollama.url}/api/chat`,
      {
        model: config.ollama.model,
        stream: false,
        messages: [
          { role: 'system', content: `${SYSTEM_PROMPT}\n\nContexto real de CryptoDiego:\n${context}` },
          ...normalizeHistory(history),
          { role: 'user', content: message }
        ]
      },
      { timeout: config.ollama.timeoutMs }
    );

    const text = data?.message?.content || data?.response;
    if (!text || typeof text !== 'string') {
      throw new Error('Ollama devolvió una respuesta vacía.');
    }
    return { text: text.trim(), source: 'ollama' };
  } catch {
    return { text: fallback.answer(message), source: 'fallback' };
  }
}

module.exports = { ask, SYSTEM_PROMPT };

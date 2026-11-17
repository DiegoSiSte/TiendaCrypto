const faqs = [
  {
    keywords: ['asesoria', 'asesoría', 'asesor'],
    answer:
      'La asesoría cripto es una sesión de 60 min desde 49 USD: revisamos tu cartera y sales con un plan concreto.'
  },
  {
    keywords: ['comprar', 'vender', 'compra', 'venta', 'exchange'],
    answer:
      'En compra y venta asistida te acompañamos paso a paso, desde la verificación del exchange hasta la orden, desde 29 USD.'
  },
  {
    keywords: ['wallet', 'wallets', 'cartera', 'semilla', 'cold wallet', 'hardware'],
    answer:
      'Configuramos wallets calientes, frías y multisig desde 39 USD, con copia de seguridad y prueba de recuperación.'
  },
  {
    keywords: ['staking', 'validator', 'validador', 'rendimiento'],
    answer:
      'El staking gestionado selecciona validadores y documenta comisiones y rendimiento estimado. Plana mensual desde 19 USD.'
  },
  {
    keywords: ['auditoria', 'auditoría', 'smart contract', 'contrato', 'bug', 'solidity'],
    answer:
      'Auditamos smart contracts en 5 a 10 días desde 499 USD: lógica, permisos, gas y un informe priorizado.'
  },
  {
    keywords: ['dca', 'promedio', 'compra periodica', 'periódica'],
    answer:
      'La estrategia DCA automatiza compras periódicas con importes y rebalanceo definidos. Sesión de 60 min por 59 USD.'
  },
  {
    keywords: ['fiscal', 'impuesto', 'declarar', 'reporte'],
    answer:
      'El reporte fiscal cripto ordena exchanges y wallets en un resumen de ganancias, pérdidas y comisiones. Desde 79 USD.'
  },
  {
    keywords: ['investigacion', 'investigación', 'token', 'proyecto', 'due diligence', 'whitepaper'],
    answer:
      'Investigamos tokens en 48 h desde 129 USD: equipo, tokenómica, liquidez, contrato y señales de riesgo.'
  },
  {
    keywords: ['servicios', 'servicio', 'ofrecen', 'ofrece'],
    answer:
      'Ofrecemos asesoría, compra y venta asistida, wallets, staking, auditoría, DCA, reporte fiscal e investigación de tokens.'
  },
  {
    keywords: ['tienda', 'productos', 'catalogo', 'catálogo', 'comprar producto'],
    answer:
      'La tienda tiene hardware wallets, merch, cursos y accesorios. Puedes llegar desde el menú Tienda.'
  },
  {
    keywords: ['ledger', 'trezor', 'safepal', 'keepkey', 'dispositivo'],
    answer:
      'Vendemos Ledger Nano S Plus, Trezor Model T, SafePal S1 y KeepKey. Todos se pagan con cripto.'
  },
  {
    keywords: ['merch', 'hoodie', 'gorra', 'taza', 'poster', 'camiseta'],
    answer:
      'Tenemos hoodie, gorra HODL, taza Diamond Hands, póster Orbitron y stickers con envío calculado en el checkout.'
  },
  {
    keywords: ['curso', 'cursos', 'defi', 'trading', 'aprender'],
    answer:
      'Hay cursos de DeFi 101, Auditoría de Smart Contracts y Trading Spot con laboratorios prácticos.'
  },
  {
    keywords: ['carrito', 'cart', 'agregar', 'añadir'],
    answer:
      'Agrega productos desde la tienda, revisa el carrito y continúa al checkout para elegir la moneda de pago.'
  },
  {
    keywords: ['checkout', 'pagar', 'pago', 'comprar con cripto'],
    answer:
      'En checkout eliges BTC, ETH o USDT, ves el monto convertido, copias la dirección, escaneas el QR y pegas el hash.'
  },
  {
    keywords: ['btc', 'bitcoin'],
    answer:
      'Aceptamos BTC en la red Bitcoin. La dirección y el monto convertido aparecen en el checkout.'
  },
  {
    keywords: ['eth', 'ethereum'],
    answer:
      'Aceptamos ETH en la red Ethereum. Revisa siempre la dirección antes de enviar la transacción.'
  },
  {
    keywords: ['usdt', 'tether'],
    answer:
      'Aceptamos USDT en la red Ethereum (ERC-20). El monto se calcula con el precio en vivo de CoinGecko.'
  },
  {
    keywords: ['monedas', 'moneda', 'aceptadas', 'cryptomonedas', 'criptomonedas'],
    answer:
      'Aceptamos BTC, ETH y USDT. El precio se convierte automáticamente con CoinGecko.'
  },
  {
    keywords: ['precio', 'conversion', 'convertir', 'cotizacion', 'cotización', 'tasa'],
    answer:
      'Los precios en vivo vienen de CoinGecko y se cachean 10 minutos. En checkout ves el equivalente en tu moneda elegida.'
  },
  {
    keywords: ['direccion', 'dirección', 'wallet address', 'donde enviar'],
    answer:
      'La dirección de destino se muestra en el checkout y depende de la moneda. Cópiala desde ahí, nunca desde un mensaje.'
  },
  {
    keywords: ['qr', 'codigo qr', 'código qr', 'escanear'],
    answer:
      'Generamos un QR con la dirección y el monto exacto para que tu wallet no cometa errores al copiar.'
  },
  {
    keywords: ['hash', 'tx hash', 'hash de la transaccion', 'comprobante'],
    answer:
      'Pega el hash de tu transacción en el último paso del checkout. Con eso la orden pasa a "pagada".'
  },
  {
    keywords: ['pagada', 'confirmado', 'confirmacion', 'confirmación', 'estado'],
    answer:
      'Después de pegar un hash válido, el pago queda confirmado y la orden aparece como "pagada" en tu historial.'
  },
  {
    keywords: ['historial', 'mis ordenes', 'mis órdenes', 'ordenes', 'órdenes'],
    answer:
      'Inicia sesión y abre "Mis órdenes" para ver el estado, los productos y el comprobante de cada compra.'
  },
  {
    keywords: ['registro', 'registrarme', 'cuenta', 'crear cuenta', 'signup'],
    answer:
      'Regístrate con nombre, correo y contraseña. Recibirás un token JWT para mantener la sesión iniciada.'
  },
  {
    keywords: ['login', 'iniciar sesion', 'iniciar sesión', 'acceso', 'contraseña'],
    answer:
      'Entra desde Iniciar sesión con tu correo y contraseña. Si falla, revisa los datos o crea una cuenta nueva.'
  },
  {
    keywords: ['noticias', 'news', 'actualidad'],
    answer:
      'La sección Noticias trae titulares cripto de una API pública, cacheados 10 minutos para no saturarla.'
  },
  {
    keywords: ['metamask', 'ethers', 'conectar wallet', 'conectar metamask'],
    answer:
      'Puedes conectar MetaMask desde el checkout para usar tu dirección ETH. Aun así, el pago se confirma con el hash.'
  },
  {
    keywords: ['comision', 'comisión', 'gas', 'envio', 'envío', 'coste'],
    answer:
      'El envío se calcula en el carrito. La comisión de red la define tu wallet antes de firmar la transacción.'
  },
  {
    keywords: ['devolucion', 'devolución', 'reembolso', 'garantia', 'garantía'],
    answer:
      'Escríbenos desde el chat con el número de orden y te indicamos el proceso para esa compra en particular.'
  },
  {
    keywords: ['seguridad', 'seguro', 'passphrase', 'backup', 'recuperacion', 'recuperación'],
    answer:
      'Guarda la semilla offline, usa passphrase si puedes y haz una prueba de recuperación. Nunca la compartas en el chat.'
  },
  {
    keywords: ['2fa', 'dos factores', 'autenticacion'],
    answer:
      'Activa 2FA en tu exchange y usa un hardware wallet para cantidades grandes. Aquí nunca te pediremos tu semilla.'
  },
  {
    keywords: ['hola', 'buenas', 'hey', 'que tal', 'qué tal'],
    answer:
      'Hola, soy el asistente de CryptoDiego. Pregúntame por servicios, tienda, pagos, noticias, cuentas u órdenes.'
  },
  {
    keywords: ['to the moon', 'hodl', 'diamond hands', 'luna'],
    answer:
      'HODL con cabeza: define tu riesgo y nunca inviertas lo que no puedes perder. El moon es bonus, no plan.'
  },
  {
    keywords: ['humano', 'persona', 'contacto', 'soporte', 'ayuda humana'],
    answer:
      'Este chat es automático. Para soporte humano, deja tu correo y número de orden y te contactaremos desde CryptoDiego.'
  }
];

function answer(question) {
  const text = String(question || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const match = faqs.find((faq) => faq.keywords.some((keyword) => text.includes(keyword)));
  if (match) return match.answer;

  return 'Solo puedo ayudar con CryptoDiego: servicios, tienda, pagos con cripto, noticias, cuentas y órdenes.';
}

module.exports = { answer, faqs };

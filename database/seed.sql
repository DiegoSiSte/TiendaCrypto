USE cryptodiego;

INSERT IGNORE INTO users (id, name, email, password_hash, role) VALUES
  (1, 'Diego', 'diego@cryptodiego.io', '$2b$10$koo0DXHilTkrvftB.bzqXeg61vjAmLtanNxBu.a8bnhz8lnrkb1R.', 'admin'),
  (2, 'Satoshi', 'satoshi@cryptodiego.io', '$2b$10$koo0DXHilTkrvftB.bzqXeg61vjAmLtanNxBu.a8bnhz8lnrkb1R.', 'user'),
  (3, 'Luna', 'luna@cryptodiego.io', '$2b$10$koo0DXHilTkrvftB.bzqXeg61vjAmLtanNxBu.a8bnhz8lnrkb1R.', 'user');

INSERT IGNORE INTO categories (id, name, slug, description) VALUES
  (1, 'Hardware wallets', 'hardware-wallets', 'Dispositivos para guardar tus llaves privadas fuera de internet.'),
  (2, 'Merch', 'merch', 'Ropa y objetos para los que no venden su HODL.'),
  (3, 'Cursos', 'cursos', 'Aprende DeFi, trading y auditoría desde cero.'),
  (4, 'Accesorios', 'accesorios', 'Pequeños aliados para tu rutina cripto.');

INSERT IGNORE INTO services (id, name, slug, description, long_description, icon, price_from, duration, featured, active) VALUES
  (1, 'Asesoría cripto', 'asesoria-cripto', 'Una sesión uno a uno para ordenar tu estrategia, tu cartera y tus riesgos.', 'Revisamos tu perfil, tus objetivos y tu exposición actual. Sales con un plan concreto y sin promesas de to the moon.', '◈', 49.00, '60 min', TRUE, TRUE),
  (2, 'Compra y venta asistida', 'compra-venta-asistida', 'Te acompañamos en tu primera operación, paso a paso y sin letra pequeña.', 'Elegimos el exchange, verificamos la cuenta, ejecutamos la orden y revisamos las comisiones contigo.', '⇄', 29.00, '45 min', TRUE, TRUE),
  (3, 'Configuración de wallets', 'configuracion-de-wallets', 'Wallet caliente, fría o multisig: la montamos bien desde el primer día.', 'Instalación, copia de seguridad de la semilla, passphrase y una prueba de recuperación para que no te quedes fuera.', '⬡', 39.00, '90 min', TRUE, TRUE),
  (4, 'Staking gestionado', 'staking-gestionado', 'Pon tus tokens a trabajar con delegación segura y comisiones claras.', 'Seleccionamos validadores, calculamos rendimiento estimado y dejamos documentado cada paso. Sin bloqueos ocultos.', '◎', 19.00, 'Mensual', FALSE, TRUE),
  (5, 'Auditoría de smart contracts', 'auditoria-de-smart-contracts', 'Revisión de código, pruebas y reporte de hallazgos antes de desplegar.', 'Analizamos lógica, permisos, gas y patrones de ataque. Entregas un informe priorizado con recomendaciones aplicables.', '⌘', 499.00, '5 a 10 días', TRUE, TRUE),
  (6, 'Estrategia DCA', 'estrategia-dca', 'Compra periódica automatizada con reglas que puedes mantener.', 'Diseñamos un calendario de compras, importes y rebalanceo para que no decidas con la emoción del día.', '↗', 59.00, '60 min', FALSE, TRUE),
  (7, 'Reporte fiscal cripto', 'reporte-fiscal-cripto', 'Ordena tus movimientos y entiende qué declarar, sin sustos.', 'Recopilamos exchanges, wallets y operaciones para generar un resumen claro con ganancias, pérdidas y comisiones.', '▤', 79.00, '3 días', FALSE, TRUE),
  (8, 'Investigación de tokens', 'investigacion-de-tokens', 'Due diligence de proyectos: equipo, tokenómica, liquidez y contratos.', 'Revisamos whitepaper, contrato, distribución y señales de riesgo. Recibes un informe breve con una conclusión accionable.', '◇', 129.00, '48 h', FALSE, TRUE);

INSERT IGNORE INTO products (id, category_id, name, slug, description, price_usd, stock, image_url, badge, active) VALUES
  (1, 1, 'Ledger Nano S Plus', 'ledger-nano-s-plus', 'Cold wallet con pantalla y soporte para más de 5.000 activos.', 79.00, 24, '/assets/products/hardware.svg', 'TOP VENTAS', TRUE),
  (2, 1, 'Trezor Model T', 'trezor-model-t', 'Pantalla táctil, passphrase y apertura de código para los que quieren control total.', 219.00, 11, '/assets/products/hardware.svg', NULL, TRUE),
  (3, 1, 'SafePal S1', 'safepal-s1', 'Wallet air-gapped con pantalla y firma offline por QR.', 59.00, 32, '/assets/products/hardware.svg', NULL, TRUE),
  (4, 1, 'KeepKey', 'keepkey', 'Diseño robusto y integración sencilla con tu escritorio cripto.', 149.00, 7, '/assets/products/hardware.svg', NULL, TRUE),
  (5, 2, 'CryptoDiego Hoodie', 'cryptodiego-hoodie', 'Algodón pesado, bordado neón y suficiente espacio para HODL.', 45.00, 60, '/assets/products/merch.svg', 'NUEVO', TRUE),
  (6, 2, 'HODL Cap', 'hodl-cap', 'Gorra oscura con visera y bordado HODL discreto.', 22.00, 80, '/assets/products/merch.svg', NULL, TRUE),
  (7, 2, 'Diamond Hands Mug', 'diamond-hands-mug', 'Taza de cerámica para café y decisiones a largo plazo.', 18.00, 90, '/assets/products/merch.svg', NULL, TRUE),
  (8, 2, 'Orbitron Poster', 'orbitron-poster', 'Póster A3 con el grid animado de CryptoDiego en versión impresa.', 25.00, 45, '/assets/products/merch.svg', NULL, TRUE),
  (9, 3, 'Curso DeFi 101', 'curso-defi-101', 'De swaps a liquidez, con laboratorios prácticos y riesgos explicados.', 89.00, 999, '/assets/products/course.svg', 'POPULAR', TRUE),
  (10, 3, 'Curso Auditoría de Smart Contracts', 'curso-auditoria-smart-contracts', 'Encuentra bugs antes de que te encuentren a ti. Incluye reporte final.', 249.00, 999, '/assets/products/course.svg', NULL, TRUE),
  (11, 3, 'Curso Trading Spot', 'curso-trading-spot', 'Velas, gestión de riesgo y un diario de operaciones que sí se cumple.', 69.00, 999, '/assets/products/course.svg', NULL, TRUE),
  (12, 4, 'Staking Starter Kit', 'staking-starter-kit', 'Guía impresa + plantillas para comparar validadores y rendimientos.', 39.00, 50, '/assets/products/accessory.svg', NULL, TRUE),
  (13, 4, 'NFC Seed Tag', 'nfc-seed-tag', 'Etiqueta NFC para organizar tu backup sin exponer la semilla.', 12.00, 120, '/assets/products/accessory.svg', NULL, TRUE),
  (14, 4, 'Hardware Wallet Case', 'hardware-wallet-case', 'Funda rígida con espacio para cables y tu passphrase.', 29.00, 65, '/assets/products/accessory.svg', NULL, TRUE),
  (15, 4, 'CryptoDiego Sticker Pack', 'cryptodiego-sticker-pack', 'Seis pegatinas resistentes para tu portátil, nevera o wallet.', 9.00, 200, '/assets/products/accessory.svg', NULL, TRUE);

INSERT IGNORE INTO orders (id, user_id, status, subtotal_usd, shipping_usd, total_usd) VALUES
  (1, 1, 'pagada', 103.00, 5.00, 108.00),
  (2, 2, 'pagada', 248.00, 0.00, 248.00),
  (3, 3, 'pagada', 89.00, 0.00, 89.00),
  (4, 1, 'pagada', 58.00, 8.00, 66.00),
  (5, 2, 'pendiente', 249.00, 0.00, 249.00);

INSERT IGNORE INTO order_items (id, order_id, product_id, quantity, unit_price_usd) VALUES
  (1, 1, 1, 1, 79.00),
  (2, 1, 13, 2, 12.00),
  (3, 2, 2, 1, 219.00),
  (4, 2, 14, 1, 29.00),
  (5, 3, 9, 1, 89.00),
  (6, 4, 7, 2, 18.00),
  (7, 4, 6, 1, 22.00),
  (8, 5, 10, 1, 249.00);

INSERT IGNORE INTO payments (id, order_id, currency, amount_crypto, wallet_address, tx_hash, status) VALUES
  (1, 1, 'BTC', 0.00161194, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlha1b2c3d4e5f60718293a4b5c6d7e8f90', 'confirmado'),
  (2, 2, 'ETH', 0.07085714, '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', '0xa1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f901234', 'confirmado'),
  (3, 3, 'USDT', 89.00000000, '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', '0xb2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f9012345', 'confirmado'),
  (4, 4, 'ETH', 0.01885714, '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', '0xc3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90123456', 'confirmado'),
  (5, 5, 'BTC', 0.00371642, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', '0xd4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f901234567', 'pendiente');

INSERT IGNORE INTO news_cache (id, cache_key, payload) VALUES
  (1, 'crypto_news', '[{"id":"seed-1","title":"Bitcoin mantiene el interés institucional","url":"https://www.coindesk.com/","source":"CoinDesk","published":"2026-11-17T08:00:00Z","body":"Resumen de ejemplo cargado con el seed de CryptoDiego."},{"id":"seed-2","title":"Ethereum sigue impulsando el ecosistema DeFi","url":"https://www.coindesk.com/","source":"CoinDesk","published":"2026-11-17T07:30:00Z","body":"Noticia de ejemplo para probar el cache de 10 minutos."}]');

INSERT IGNORE INTO chat_logs (id, user_id, message, response, source) VALUES
  (1, 1, '¿Qué servicios ofrecen?', 'Ofrecemos asesoría, compra y venta asistida, wallets, staking, auditoría y más.', 'fallback'),
  (2, NULL, '¿Cómo pago con cripto?', 'Elige BTC, ETH o USDT, copia la dirección, paga y pega el hash de la transacción.', 'fallback');

# CryptoDiego

Plataforma web cripto en monorepo: Angular + Express + MySQL, con precios de CoinGecko, noticias cacheadas, pagos simulados con BTC/ETH/USDT y chatbot con Ollama.

**Demo en GitHub Pages:** https://diegosiste.github.io/TiendaCrypto/ (frontend estático; login, órdenes y pagos requieren el backend en ejecución).

El deploy se publica automáticamente con GitHub Actions en cada push a `main`.

## Arquitectura de 3 capas

```text
Presentación (FrontEnd/)
  Angular 22 · standalone components · routing lazy · HttpClient · señales
  Páginas: inicio, servicios, tienda, producto, carrito, checkout, órdenes, noticias, auth
  Widget de chat flotante en todas las rutas
        |
        | HTTPS / JSON + JWT
        v
Lógica de negocio (BackEnd/)
  Node.js + Express
  app.js -> routes -> controllers -> services -> models -> middleware
  Caché de precios/noticias · JWT + bcrypt · Ollama + fallback FAQ
        |
        | mysql2/promise
        v
Datos (database/ + MySQL)
  users, services, categories, products, orders, order_items,
  payments, news_cache, chat_logs
```

El frontend nunca accede a MySQL: todo pasa por la API REST.

## Estructura

```text
CryptoDiego/
├── FrontEnd/            Proyecto Angular existente, movido aquí
│   ├── public/assets/   Logos de monedas, SVGs de productos y videos/
│   └── src/app/
│       ├── core/        API, auth, carrito, precios, catálogo, órdenes, chat, modelos
│       ├── features/    Páginas lazy
│       └── shared/      Ticker, widget de chat, directivas reveal/count-up/tilt
├── BackEnd/             API Express
│   ├── app.js
│   ├── .env.example
│   └── src/{config,controllers,middleware,models,routes,services}
├── database/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

## Requisitos

- Node.js 22+ y npm 10+
- MySQL 8+ (o MariaDB compatible)
- Ollama con el modelo `gemma3` (opcional; sin él el chat usa fallback)
- Angular CLI incluido en `FrontEnd/node_modules`

## Instalación

### 1. Base de datos

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p cryptodiego < database/seed.sql
```

El seed crea 8 servicios, 15 productos, 3 usuarios, 5 órdenes con pagos, noticias de ejemplo y logs de chat.

### 2. Backend

```bash
cd BackEnd
npm install
cp .env.example .env        # Windows: Copy-Item .env.example .env
npm run dev                 # o npm start
```

API en `http://localhost:3001`. Verifica con `GET /api/health`.

Variables importantes de `BackEnd/.env`:

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto de la API, por defecto 3001 |
| `FRONTEND_URL` | Origen permitido por CORS, por defecto `http://localhost:4200` |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión MySQL |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Firma de tokens |
| `WALLET_BTC`, `WALLET_ETH`, `WALLET_USDT` | Direcciones mostradas en checkout |
| `OLLAMA_URL`, `OLLAMA_MODEL`, `OLLAMA_TIMEOUT_MS` | Chatbot local |
| `COINGECKO_URL`, `CRYPTOCOMPARE_NEWS_URL` | Fuentes públicas |
| `PRICES_CACHE_TTL_MS`, `NEWS_CACHE_TTL_MS` | Caché, 600000 ms por defecto |

### 3. Ollama (opcional)

```bash
ollama pull gemma3
ollama serve
```

El backend llama a `http://localhost:11434/api/chat`. Si no responde, usa 36 preguntas frecuentes precargadas y guarda el historial en `chat_logs` cuando MySQL está disponible.

Antes de llamar al modelo se inyectan servicios y productos reales, monedas aceptadas, pasos de pago y precios de referencia. El system prompt obliga a responder solo sobre CryptoDiego, en español y de forma breve.

### 4. Frontend

```bash
cd FrontEnd
npm install
npm start               # o npm run dev
```

App en `http://localhost:4200`. Para compilar: `npm run build`. Pruebas: `npm test`.

## API REST

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/auth/register` | Registro con bcrypt + JWT |
| POST | `/api/auth/login` | Login con JWT |
| GET | `/api/auth/me` | Usuario autenticado |
| GET | `/api/services` | Servicios activos |
| GET | `/api/products` | Productos (`category`, `search`, `limit`) |
| GET | `/api/products/:id` | Detalle de producto |
| POST | `/api/orders` | Crear orden desde el carrito |
| GET | `/api/orders/me` | Historial del usuario |
| GET | `/api/payments/addresses` | Direcciones por moneda |
| POST | `/api/payments` | Registrar pago con `tx_hash` y marcar orden pagada |
| GET | `/api/payments/:orderId` | Pago de una orden |
| GET | `/api/prices` | Top 10 de CoinGecko con caché |
| GET | `/api/news` | Noticias de CryptoCompare con caché de 10 min |
| POST | `/api/chat` | Chatbot con contexto de BD y fallback |

Rutas protegidas: órdenes, pagos por orden y registro de pago requieren `Authorization: Bearer <token>`.

## Flujo de pago simulado

1. El carrito calcula el total en USD.
2. En checkout se elige BTC, ETH o USDT y se muestra el equivalente usando `/api/prices`.
3. Se muestran la dirección de wallet y un QR generado en el cliente.
4. Opcionalmente se conecta MetaMask con `ethers.js` (para ETH/USDT).
5. El usuario pega el `tx_hash` y el backend crea la orden, registra el pago y la marca como `pagada`.

No se envían fondos reales: es una simulación para demostrar el flujo.

## UI/UX

Tema oscuro con grid animado, glassmorphism y neón (`#00ff9d`, `#8a2be2`, `#f7931a`). Tipografías Orbitron para títulos, Space Grotesk para interfaz e Inter para texto. Incluye ticker continuo, contadores, reveal on scroll, hover 3D, monedas flotando en el hero y transiciones de ruta.

Las decisiones visuales se guiaron por la skill `frontend-design` (Anthropic, vía skills.sh): una sola momento memorable en el hero, estructura de terminal de trading en lugar de tarjetas genéricas, movimiento contenido y `prefers-reduced-motion` respetado.

Para añadir video hero, coloca un archivo en `FrontEnd/public/assets/videos/hero.mp4`. Si no existe, el hero usa el fondo animado SVG/CSS.

## Usuarios de ejemplo

| Correo | Contraseña |
| --- | --- |
| diego@cryptodiego.io | Demo1234! |
| satoshi@cryptodiego.io | Demo1234! |
| luna@cryptodiego.io | Demo1234! |

Cambia `JWT_SECRET` y las direcciones de wallet en `.env` antes de subir a producción.

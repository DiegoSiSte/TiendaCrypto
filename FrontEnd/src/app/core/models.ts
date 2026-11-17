export interface Price {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  image: string;
  lastUpdated?: string | null;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  longDescription: string | null;
  icon: string;
  priceFrom: number;
  duration: string | null;
  featured: boolean;
}

export interface Product {
  id: number;
  categoryId: number;
  categoryName: string | null;
  categorySlug: string | null;
  name: string;
  slug: string;
  description: string | null;
  priceUsd: number;
  stock: number;
  imageUrl: string | null;
  badge: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitPriceUsd: number;
}

export interface Payment {
  id: number;
  orderId: number;
  currency: string;
  amountCrypto: number;
  walletAddress: string;
  txHash: string;
  status: string;
  createdAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  payment?: Payment | null;
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published: string | null;
  body: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ChatEntry {
  role: 'user' | 'assistant';
  content: string;
}

export interface ApiError {
  error: string;
}

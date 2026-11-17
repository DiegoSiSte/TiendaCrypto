import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'CryptoDiego | Inicio',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'servicios',
    title: 'Servicios cripto | CryptoDiego',
    loadComponent: () => import('./features/services/services.page').then((m) => m.ServicesPage)
  },
  {
    path: 'tienda',
    title: 'Tienda | CryptoDiego',
    loadComponent: () => import('./features/shop/shop.page').then((m) => m.ShopPage)
  },
  {
    path: 'tienda/:id',
    title: 'Producto | CryptoDiego',
    loadComponent: () => import('./features/shop/product.page').then((m) => m.ProductPage)
  },
  {
    path: 'carrito',
    title: 'Carrito | CryptoDiego',
    loadComponent: () => import('./features/cart/cart.page').then((m) => m.CartPage)
  },
  {
    path: 'checkout',
    title: 'Pagar con cripto | CryptoDiego',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPage)
  },
  {
    path: 'ordenes',
    title: 'Mis órdenes | CryptoDiego',
    canActivate: [authGuard],
    loadComponent: () => import('./features/orders/orders.page').then((m) => m.OrdersPage)
  },
  {
    path: 'noticias',
    title: 'Noticias cripto | CryptoDiego',
    loadComponent: () => import('./features/news/news.page').then((m) => m.NewsPage)
  },
  {
    path: 'auth',
    title: 'Acceder | CryptoDiego',
    loadComponent: () => import('./features/auth/auth.page').then((m) => m.AuthPage)
  },
  {
    path: '**',
    title: 'Página no encontrada | CryptoDiego',
    loadComponent: () => import('./features/not-found/not-found.page').then((m) => m.NotFoundPage)
  }
];

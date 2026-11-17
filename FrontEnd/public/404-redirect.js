try {
  sessionStorage.setItem('cryptodiego_redirect', location.pathname + location.search + location.hash);
} catch (_) {}
location.replace('/TiendaCrypto/');

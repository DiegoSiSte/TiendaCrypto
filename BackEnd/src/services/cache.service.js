const store = new Map();

function peek(key) {
  const entry = store.get(key);
  if (!entry) return null;
  return {
    data: entry.data,
    cachedAt: new Date(entry.at).toISOString(),
    source: entry.source || 'cache',
    stale: false
  };
}

async function getOrSet(key, ttlMs, loader) {
  const now = Date.now();
  const cached = store.get(key);

  if (cached && now - cached.at < ttlMs) {
    return {
      data: cached.data,
      cachedAt: new Date(cached.at).toISOString(),
      source: cached.source || 'cache',
      stale: false
    };
  }

  const fresh = await loader();
  store.set(key, { data: fresh.data, source: fresh.source, at: now });
  return {
    data: fresh.data,
    cachedAt: new Date(now).toISOString(),
    source: fresh.source,
    stale: false
  };
}

module.exports = { getOrSet, peek };

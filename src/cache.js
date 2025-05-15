const LRU = require('lru-cache').LRUCache;


const cache = new LRU({
  max: 100,
  ttl: 1000 * 60 * 5
});

module.exports = cache;

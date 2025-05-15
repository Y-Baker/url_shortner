# Workshop Part 2: Storage Options & Persistence

---

## 🤔 Why Not Just In-Memory?

While `MemoryStorage` (like using a JavaScript object or a Map) is great for:

* Prototyping
* Speed
* Simplicity

It fails in real-world scenarios due to:

* **Volatility**: Data is lost on restart.
* **Scalability issues**: Doesn’t support horizontal scaling or work across distributed servers.
* **No persistence**: No history, backups, or analysis.

---

## 📃 Storage Options Breakdown

### 1. 🚫 In-Memory Storage

* **Examples**: Plain JS object, Redis (in-memory mode)
* **Pros**:

  * Fast
  * Easy to implement
* **Cons**:

  * Data lost on server restart
  * Not shareable across instances
* **Use Case**: Prototyping, session or caching layer

---

### 2. 🔎 File-Based Storage

* **Examples**: JSON, CSV, TXT
* **Pros**:

  * Simple to set up
  * No external service required
* **Cons**:

  * Prone to corruption
  * Poor for concurrent writes or reads
* **Use Case**: Quick scripts, small apps, logs

---

### 3. 📁 Relational Databases (SQL)

* **Examples**: SQLite, MySQL, PostgreSQL
* **Pros**:

  * Structured & enforceable schema
  * Supports complex queries & relationships
* **Cons**:

  * Setup and migration needed
  * Schema fixed

---

### 4. 🧳 NoSQL Databases

* **Examples**: MongoDB, Firebase, Redis (key-value), Cassandra
* **Pros**:

  * Flexible schema (good for evolving apps)

  * Works naturally with JSON
* **Cons**:

  * Some don’t support transactions
  * Query complexity

**Use Case**: Real-time apps, flexible data, document-heavy content

---

## 🔀 Comparison Table

| Criteria                        | In-Memory | File-Based | SQLite | MongoDB |
| ------------------------------- | --------- | ---------- | ------ | ------- |
| Speed                           | ✅         | ✅          | ✅      | ✅       |
| Persistence                     | ❌         | ✅          | ✅      | ✅       |
| Setup Complexity                | ✅         | ✅          | ✅      | ❌       |
| Supports Querying               | ❌         | ❌          | ✅      | ✅       |
| Best for Relationships          | ❌         | ❌          | ✅      | ❌       |
| Schema Flexibility              | ✅         | ❌          | ❌      | ✅       |
| Multi-user Access / Scalability | ❌         | ❌          | ❌      | ✅       |

---

## 🚄 Caching Frequently Accessed URLs

To enhance performance, especially for frequently requested short URLs, we introduce an **in-memory cache** layer using an LRU (Least Recently Used) strategy.

### ⚙️ How It Works

* When a user requests a short URL:

  1. The server checks the cache first.
  2. If found → respond immediately (faster).
  3. If not → query the main storage, respond, and cache it.

### 🧰 Tools

* We use [`lru-cache`](https://www.npmjs.com/package/lru-cache), a simple and efficient in-memory cache library:

```bash
npm install lru-cache
```

### 🧠 Benefits

* Reduces database reads for hot data
* Improves latency and scalability
* Teaches real-world caching strategies

### 🔍 Optional Extension

Expose a route like `/cache/stats` to display hit/miss info (great for learning and monitoring during dev).

---

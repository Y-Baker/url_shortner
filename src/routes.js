require('dotenv').config();
const express = require('express');
const router = express.Router();
const url_shortner = require("./utils").url_shortner;
const storage_engine = require("./storage/engine");
const cache = require('./cache');

const getRouter = async () => {
  const router = express.Router();
  const database = await storage_engine.GetStorage(process.env.database);

  const shortner = (url) => {
    const short = url_shortner(url);
    try {
      database.save(url, short);
    } catch (error) {
      console.error("Error saving URL:", error);
      return null;
    }
    return short;
  };

  /**
   * @swagger
   * /shorten:
   *   post:
   *     summary: Shorten a URL
   *     description: Takes a long URL and returns a shortened version.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               url:
   *                 type: string
   *                 example: "https://example.com"
   *     responses:
   *       200:
   *         description: Shortened URL
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 url:
   *                   type: string
   */
  router.post("/shorten", (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    const short = shortner(url);
    if (!short) {
      return res.status(500).json({ error: "Failed to shorten URL" });
    }
    res.json({ url: short });
  });

  /**
  * @swagger
  * /{short}:
  *   get:
  *     summary: Redirect to the original URL
  *     description: Redirects the shortened URL to the original long URL.
  *     parameters:
  *       - in: path
  *         name: short
  *         required: true
  *         schema:
  *           type: string
  *     responses:
  *       302:
  *         description: Redirects to the original URL
  *       404:
  *         description: URL not found
  */
  router.get("/:short", async (req, res) => {
    const { short } = req.params;

    if (cache.has(short)) {
      console.log("CACHE HIT")
      return res.redirect(cache.get(short))

    }

    if (! await database.contains(short)) {
      return res.status(404).json({ mess: "Not found" });
    }
    await database.increaseCount(short);

    const re = await database.get(short)
    cache.set(short, re);
    console.log("CACHE MISS");
  
    res.redirect(re);
  });

  /**
  * @swagger
  * /{short}/info:
  *   get:
  *     summary: Get original URL info
  *     description: Returns the original URL associated with a short URL.
  *     parameters:
  *       - in: path
  *         name: short
  *         required: true
  *         schema:
  *           type: string
  *     responses:
  *       200:
  *         description: URL information
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 url:
  *                   type: string
  *       404:
  *         description: URL not found
  */
  router.get("/:short/info", async (req, res) => {
    const { short } = req.params;
    if (! await database.contains(short)) {
      return res.status(404).json({ mess: "Not found" });
    }
    const re = await database.info(short);
    res.json({ url: re.longUrl, clicks: re.ClickCounter, last_access: re.LastAccess});
  });


  router.get("/cache/stats", (req, res) => {
    res.json({
      size: cache.size,
      maxSize: cache.max,
      ttl: cache.ttl
    });
  });

  return router;
};


module.exports = getRouter;
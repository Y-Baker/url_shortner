const express = require("express");
const url_shortner = require("./utils").url_shortner;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { MemoryStorage } = require("./storage");

const app = express();
const database = new MemoryStorage();

const port = 5000;

app.use(express.json());

const shortner = (url) => {
  const short = url_shortner(url);
  database.save(url, short);
  return short;
};

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "A simple URL shortener API",
    },
  },
  apis: ["./index.js"], // Point to this file
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

app.post("/shorten", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  const short = shortner(url);
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
app.get("/:short", (req, res) => {
  const { short } = req.params;

  if (!database.constains(short)) {
    return res.status(404).json({ mess: "Not found" });
  }

  res.redirect(database[short]);
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
app.get("/:short/info", (req, res) => {
  const { short } = req.params;

  if (!database.constains(short)) {
    return res.status(404).json({ mess: "Not found" });
  }

  res.json({ url: database[short] });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
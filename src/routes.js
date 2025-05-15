const express = require('express');
const router = express.Router();
const url_shortner = require("./utils").url_shortner;
const storage_engine = require("./storage/engine");

const getRouter = async () => {
  const router = express.Router();
  const database = await storage_engine.GetStorage("sqlite");

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

  router.get("/:short", async (req, res) => {
    const { short } = req.params;
    if (! await database.contains(short)) {
      return res.status(404).json({ mess: "Not found" });
    }
    res.redirect(await database.get(short));
  });

  router.get("/:short/info", async (req, res) => {
    const { short } = req.params;
    if (! await database.contains(short)) {
      return res.status(404).json({ mess: "Not found" });
    }
    res.json({ url: await database.get(short) });
  });

  return router;
};


module.exports = getRouter;
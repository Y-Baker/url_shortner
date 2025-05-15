const mongoose = require('mongoose');
const { DATE } = require('sequelize');
const cache = require('../cache');
const { Schema } =  mongoose

mongoose
  .connect('mongodb://localhost:27017/url_shortner')
  .then(() => console.log("Mongodb Connected"))
  .catch((err) => console.error(err))


const urlSchema = new Schema(
  {
    longUrl: { type: String, required: true, unique: true },
    shortUrl: { type: String, required: true, unique: true },
    ClickCounter: { type: Number, default: 0 },
    LastAccess: { type: Date, default: Date.now }
  }
)

const Url = mongoose.model('Url', urlSchema);

class MongodbStorage {
  async init() {
    await mongoose.connection;
    const result = await Url
      .find()
      .sort({ClickCounter: 'asc'})
      .limit(cache.max)
      .select({ longUrl: 1, shortUrl: 1});
    
    
    result.map((obj) => cache.set(obj.shortUrl, obj.longUrl));
  }

  async save(longUrl, shortUrl) {
    const url = new Url({ longUrl, shortUrl });
    await url.save();
  }

  async get(shortUrl) {
    const result = await Url.findOne( { shortUrl });
    return result?.longUrl || null;
  }

  async contains(shortUrl) {
    const result = await Url.findOne( { shortUrl });
    return !!result;
  }

  async info(shortUrl) {
    return await Url.findOne( { shortUrl });
  }

  async increaseCount(shortUrl) {
    const result = await Url.findOne( { shortUrl });
    result.ClickCounter++;

    result.LastAccess = Date.now();
    await result.save();
  }
}

module.exports = MongodbStorage;
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db',
});

const db = sequelize.define('URL', {
  longUrl: { type: DataTypes.STRING, allowNull: false },
  shortUrl: { type: DataTypes.STRING, allowNull: false, unique: true },
});

class SQLiteStorage {
  async init() {
    await sequelize.sync();
  }

  async save(longUrl, shortUrl) {
    await db.create({ longUrl, shortUrl });
    console.log(`Saved: ${longUrl} -> ${shortUrl}`);
  }

  async get(shortUrl) {
    const result = await db.findOne({ where: { shortUrl } });
    return result?.dataValues?.longUrl || null;
  }

  async contains(shortUrl) {
    const result = await db.findOne({ where: { shortUrl } });
    return !!result.dataValues;
  }

  async info(shortUrl) {
    return await db.findOne({ where: { shortUrl } });
  }
}

module.exports = SQLiteStorage;

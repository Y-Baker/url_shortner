const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db',
});

const db = sequelize.define('URL', {
  longUrl: { type: DataTypes.STRING, allowNull: false },
  shortUrl: { type: DataTypes.STRING, allowNull: false, unique: true },
  ClickCounter: { type: DataTypes.INTEGER, defaultValue: 0 },
  LastAccess: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

class SQLiteStorage {
  async init() {
    await sequelize.sync({ force: true });
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
    return !!result;
  }

  async info(shortUrl) {
    return await db.findOne({ where: { shortUrl } });
  }

  async increaseCount(shortUrl) {
    const result = await db.findOne({ where: { shortUrl } }); 
    if (!result) return null;


    result.ClickCounter++;
    result.LastAccess = new Date(); 
    return await result.save();
  }
}

module.exports = SQLiteStorage;

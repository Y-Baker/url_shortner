

const GetStorage = async (type) => {
  switch (type) {
    case "memory":
      const MemoryStorage = require("./memory.js");
      db = new MemoryStorage();
      break;
    case "sqlite":
      const SQLiteStorage = require("./sqlite.js");
      db = new SQLiteStorage();
      break;
    case "mongodb":
      const MongodbStorage = require("./mongodb.js");
      db = new MongodbStorage();
      break;
    default:
      throw new Error("Invalid storage type");
  }

  await db.init();
  return db;
}

module.exports = {
  GetStorage,
};
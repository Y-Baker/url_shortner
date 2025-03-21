class MemoryStorage {
  constructor() {
    this.database = {};
  }

  get(url) {
    return this.database.get(url);
  }

  save(url, short) {
    if (this.database[url]) {
      throw new Error('URL already exists');
    }
    this.database[url] = short;
  }

  delete(url) {
    if (!this.database[url]) {
      throw new Error('URL not found in database');
    }
    delete this.database[url];
  }

  update(url, short) {
    if (!this.database[url]) {
      throw new Error('URL not found in database');
    }
    this.database[url] = short;
  }

  constains(url) {
    return !!this.database[url];
  }
}


module.exports = {
  MemoryStorage
}

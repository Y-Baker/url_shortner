class MemoryStorage {
  constructor() {
    this.database = {};
  }

  init() {
    this.database = {};
  }

  get(url) {
    return this.database[url];
  }

  save(url, short) {
    if (this.database[short]) {
      throw new Error('URL already exists');
    }
    this.database[short] = url;
  }

  delete(url) {
    if (!this.database[url]) {
      throw new Error('URL not found in database');
    }
    delete this.database[url];
  }

  update(url, short) {
    if (!this.database[short]) {
      throw new Error('URL not found in database');
    }
    this.database[short] = url;
  }

  contains(url) {
    return !!this.database[url]; 
  }
}


module.exports = MemoryStorage;

let Store = null

if (typeof window !== 'undefined' && window.require) {
  // https://github.com/electron/electron/issues/7300
  Store = window.require('electron-store')
} else {
  Store = require('electron-store')
}

const EventEmitter = require('events')

class StoreService extends EventEmitter {
  constructor() {
    super()

    this._store = new Store()
  }

  get(key) {
    return this._store.get(key)
  }

  set(key, value) {
    this._store.set(key, value)
    this.emit(key, value)
    return this._store.get(key)
  }

  delete(key) {
    return this._store.delete(key)
  }
}

const storeService = new StoreService()

module.exports = storeService;

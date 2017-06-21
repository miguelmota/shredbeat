// https://github.com/electron/electron/issues/7300
const Store = window.require('electron-store')

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
}

const storeService = new StoreService()

module.exports = storeService;

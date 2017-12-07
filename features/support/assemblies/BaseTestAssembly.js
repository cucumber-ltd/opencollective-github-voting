const uuid = require('uuid/v4')

module.exports = class BaseTestAssembly {

  constructor() {
    this._actors = new Map()
    this._ids = new Map()
  }

  // Get a "named" id
  id(name) {
    if (!this._ids.has(name))
      this._ids.set(name, uuid())
    return this._ids.get(name)
  }
}

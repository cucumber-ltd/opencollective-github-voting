const uuid = require('uuid/v4')
const ServerAssembly = require('../../../lib/ServerAssembly')
const SimulatingCommitsProvider = require('../../../lib/commits/SimulatorCommitsProvider')

module.exports = class BaseTestAssembly {

  constructor() {
    this._actors = new Map()
    this._ids = new Map()

    const commitsProvider = new SimulatingCommitsProvider()
    this.context = new ServerAssembly({ commitsProvider })
  }

  // Get a "named" id
  id(name) {
    if (!this._ids.has(name))
      this._ids.set(name, uuid())
    return this._ids.get(name)
  }
}

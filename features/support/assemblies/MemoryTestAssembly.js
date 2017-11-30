const ServerAssembly = require('../../../lib/ServerAssembly')
const BaseTestAssembly = require('./BaseTestAssembly')

module.exports = class MemoryTestAssembly extends BaseTestAssembly {
  constructor() {
    super()
    const serverAssembly = new ServerAssembly()
    this._contextAssembly = serverAssembly
    this._actionAssembly = serverAssembly
    this._outcomeAssembly = serverAssembly
  }

  async start() {
  }

  async stop() {
  }
}
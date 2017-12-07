const ServerAssembly = require('../../../lib/ServerAssembly')
const BaseTestAssembly = require('./BaseTestAssembly')

module.exports = class MemoryTestAssembly extends BaseTestAssembly {
  constructor() {
    super()
    this.context = new ServerAssembly()
  }

  async actor(accountHolder) {
    return this.context
  }

  async start() {
  }

  async stop() {
  }
}
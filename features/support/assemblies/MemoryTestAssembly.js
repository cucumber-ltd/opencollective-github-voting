const BaseTestAssembly = require('./BaseTestAssembly')

module.exports = class MemoryTestAssembly extends BaseTestAssembly {
  async actor(accountHolder) {
    return this.context
  }

  async start() {
  }

  async stop() {
  }
}
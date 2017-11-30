const TestAssembly = require('./TestAssembly')

module.exports = class MemoryAssembly extends TestAssembly {
  get actionTransferCommands() {
    return this.transferCommands
  }

  get actionUserCommands() {
    return this.userCommands
  }

  get outcomeAccountQueries() {
    return this.accountQueries
  }

  get contextPubSub() {
    return this.pubSub
  }
}
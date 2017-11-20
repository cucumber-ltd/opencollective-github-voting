const TestAssembly = require('./TestAssembly')

module.exports = class MemoryAssembly extends TestAssembly {
  get actionTransferCommands() {
    return this.transferCommands
  }

  get outcomeAccountQueries() {
    return this.accountQueries
  }
}
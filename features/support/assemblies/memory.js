const TestAssembly = require('./TestAssembly')

module.exports = class MemoryAssembly extends TestAssembly {
  get actionVotingPort() {
    return this.votingPort
  }

  get outcomeAccountStore() {
    return this.accountStore
  }
}
const Assembly = require('../../../lib/Assembly')
const NullSignals = require('../../../test_support/NullSignals')

module.exports = class MemoryAssembly extends Assembly {
  contextVotingPort() {
    return this.votingPort
  }

  actionVotingPort() {
    return this.votingPort
  }

  outcomeVotingPort() {
    return this.votingPort
  }

  _makeAccountSignals() {
    return new NullSignals()
  }
}
const Assembly = require('../../../lib/Assembly')

module.exports = class MemoryAssembly extends Assembly {
  contextVotingPort() {
    return this._votingPort
  }

  actionVotingPort() {
    return this._votingPort
  }

  outcomeVotingPort() {
    return this._votingPort
  }
}
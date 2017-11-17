const Preact = require('preact')
const { h } = Preact
const Assembly = require('../../../lib/Assembly')
const DomVotingPort = require('../../../test_support/DomVotingPort')
const VotingList = require('../../../lib/client/UI')
const PreactSignals = require('../../../lib/client/PreactSignals')

module.exports = class DomMemoryAssembly extends Assembly {
  constructor() {
    super()

    // Establish circular dependency
    // TODO: Split projection into projector and store to avoid this
    this.accountSignals.accountProjection = this.accountProjection

    const domNode = document.body
    Preact.render(h(VotingList, {votingPort: this._votingPort}), domNode)
    this._domVotingPort = new DomVotingPort(domNode)
  }

  contextVotingPort() {
    return this.votingPort
  }

  actionVotingPort() {
    return this._domVotingPort
  }

  outcomeVotingPort() {
    return this._domVotingPort
  }

  _makeAccountSignals() {
    return new PreactSignals()
  }
}
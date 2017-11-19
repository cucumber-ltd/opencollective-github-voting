const { h, render } = require('preact')
const TestAssembly = require('./TestAssembly')
const DomVotingPort = require('../../../test_support/DomVotingPort')
const DomAccountList = require('../../../test_support/DomAccountList')
const { VotingApp } = require('../../../lib/client/UI')

module.exports = class DomMemoryAssembly extends TestAssembly {
  constructor() {
    super()

    const accountNumber = { owner: '@bob', currency: 'votes' }

    const $domNode = document.body
    const props = { votingPort: this.votingPort, accountStore: this.accountStore, accountNumber }
    render(h(VotingApp, props), $domNode)
    this._domVotingPort = new DomVotingPort($domNode)
    this._domAccountStore = new DomAccountList($domNode)
  }

  get actionVotingPort() {
    return this._domVotingPort
  }

  get outcomeAccountStore() {
    return this._domAccountStore
  }
}
const { h, render } = require('preact')
const TestAssembly = require('./TestAssembly')
const DomTransferCommands = require('../../../test_support/DomTransferCommands')
const DomAccountQueries = require('../../../test_support/DomAccountQueries')
const { VotingApp } = require('../../../lib/client/UI')

module.exports = class DomMemoryAssembly extends TestAssembly {
  constructor() {
    super()

    // TODO: Get this from a provider
    const accountNumber = { number: '@bob', currency: 'votes' }

    const $domNode = document.body
    const props = { transferCommands: this.transferCommands, accountQueries: this.accountQueries, accountNumber }
    render(h(VotingApp, props), $domNode)

    this._domTransferCommands = new DomTransferCommands($domNode)
    this._domAccountQueries = new DomAccountQueries($domNode)
  }

  get actionTransferCommands() {
    return this._domTransferCommands
  }

  get outcomeAccountQueries() {
    return this._domAccountQueries
  }
}
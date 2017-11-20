const { h, render } = require('preact')
const TestAssembly = require('./TestAssembly')
const DomTransferCommands = require('../../../test_support/DomTransferCommands')
const DomAccountList = require('../../../test_support/DomAccountList')
const { VotingApp } = require('../../../lib/client/UI')

module.exports = class DomMemoryAssembly extends TestAssembly {
  constructor() {
    super()

    // TODO: Get this from a provider
    const accountNumber = { owner: '@bob', currency: 'votes' }

    const $domNode = document.body
    const props = { transferCommands: this.transferCommands, accountStore: this.accountStore, accountNumber }
    render(h(VotingApp, props), $domNode)

    this._domTransferCommands = new DomTransferCommands($domNode)
    this._domAccountStore = new DomAccountList($domNode)
  }

  get actionTransferCommands() {
    return this._domTransferCommands
  }

  get outcomeAccountStore() {
    return this._domAccountStore
  }
}
const { h, render } = require('preact')
const { BankApp } = require('./ui/UI')

module.exports = class PreactAssembly {
  constructor({ $domNode, accountHolderId, sub, transferCommands, bankQueries }) {
    if (!$domNode) throw new Error('No $domNode')
    if (!sub) throw new Error('No sub')
    if (!transferCommands) throw new Error('No transferCommands')
    if (!bankQueries) throw new Error('No bankQueries')
    this._$domNode = $domNode
    this._accountHolderId = accountHolderId
    this._pubSub = sub
    this._transferCommands = transferCommands
    this._bankQueries = bankQueries
  }

  async start() {
    // TODO: Add an AccountNumberProvider component that will fetch the account number of the logged-in user
    const props = {
      accountHolderId: this._accountHolderId,
      sub: this._pubSub,
      transferCommands: this._transferCommands,
      bankQueries: this._bankQueries,
    }
    render(h(BankApp, props), this._$domNode)
  }
}

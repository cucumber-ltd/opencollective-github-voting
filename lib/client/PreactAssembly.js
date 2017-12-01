const { h, render } = require('preact')
const { VotingApp } = require('./UI')

module.exports = class PreactAssembly {
  constructor({ $domNode, sub, transferCommands, accountQueries }) {
    if (!$domNode) throw new Error('No $domNode')
    if (!sub) throw new Error('No sub')
    if (!transferCommands) throw new Error('No transferCommands')
    if (!accountQueries) throw new Error('No accountQueries')
    this._$domNode = $domNode
    this._sub = sub
    this._transferCommands = transferCommands
    this._accountQueries = accountQueries
  }

  async start() {
    // TODO: Add an AccountNumberProvider component that will fetch the account number of the logged-in user
    const accountNumber = { number: '@bob', currency: 'votes' }
    const props = {
      sub: this._sub,
      transferCommands: this._transferCommands,
      accountQueries: this._accountQueries,
      accountNumber
    }
    render(h(VotingApp, props), this._$domNode)
  }
}

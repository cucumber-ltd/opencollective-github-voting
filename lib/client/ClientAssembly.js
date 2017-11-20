const { h, render } = require('preact')
const { VotingApp } = require('./UI')
const HttpTransferCommands = require('./HttpTransferCommands')
const HttpAccountQueries = require('./HttpAccountQueries')

module.exports = class ClientAssembly {
  constructor({ domNode, baseUrl, fetch }) {
    this._domNode = domNode
    this._transferCommands = new HttpTransferCommands(baseUrl, fetch)
    this._accountQueries = new HttpAccountQueries(baseUrl, fetch)
  }

  async start() {
    // TODO: Add an AccountNumberProvider component that will fetch the account number of the logged-in user
    const accountNumber = { owner: '@aslakhellesoy', currency: 'votes' }
    const props = {
      transferCommands: this._transferCommands,
      accountQueries: this._accountQueries,
      accountNumber
    }
    render(h(VotingApp, props), this._domNode)
  }
}

const { h, render } = require('preact')
const { VotingApp } = require('./UI')
const HttpVotingPort = require('./HttpTransferCommands')

function mount(domNode) {
  const fetch = window.fetch.bind(window)
  const votingPort = new HttpVotingPort('', fetch)
  const accountStore = votingPort
  const accountNumber = { owner: '@aslakhellesoy', currency: 'votes' }

// TODO: Add an AccountNumberProvider component that will fetch the account number of the logged-in user
  const props = { votingPort, accountStore, accountNumber }
  render(h(VotingApp, props), domNode)
}

mount(document.getElementById('voting'))

const assert = require('assert')
const { Given, When, Then } = require('cucumber')
const Account = require('../../lib/domain/entities/Account')

Given('{username} exists', async function(username) {
  await this.contextVotingPort().createAccount({ owner: username, currency: 'votes' })
})

Given('{issueIdentifier} exists', async function(issueIdentifier) {
  const accountNumber = { owner: issueIdentifier, currency: 'votes' }
  await this.contextVotingPort().createAccount(accountNumber)
})

Given('{username} has {int} votes', async function(username, amount) {
  const accountNumber = { owner: username, currency: 'votes' }
  await this.contextVotingPort().creditAccount(accountNumber, amount)
})

Given('{issueIdentifier} has {int} votes', async function(issueIdentifier, amount) {
  const accountNumber = { owner: issueIdentifier, currency: 'votes' }
  await this.contextVotingPort().creditAccount(accountNumber, amount)
})

When('{username} votes {int} on {issueIdentifier}', async function(username, amount, issueIdentifier) {
  const fromAccounNumber = { owner: username, currency: 'votes' }
  const toAccountNumber = {
    owner: issueIdentifier,
    currency: 'votes'
  }
  await this.actionVotingPort().transfer(fromAccounNumber, toAccountNumber, amount)
})

Then('{issueIdentifier} should have {int} votes', async function(issueIdentifier, expectedBalance) {
  const accountNumber = { owner: issueIdentifier, currency: 'votes' }
  const account = await this.outcomeVotingPort().getAccount(accountNumber)
  assert.equal(account.balance, expectedBalance)
})

Then('{username} should have {int} votes left', async function(username, expectedBalance) {
  const accountNumber = { owner: username, currency: 'votes' }
  const account = await this.outcomeVotingPort().getAccount(accountNumber)
  assert.equal(account.balance, expectedBalance)
})
const assert = require('assert')
const { Given, When, Then } = require('cucumber')
const Account = require('../../lib/domain/entities/Account')

Given('{username} exists', async function createAccount(username) {
  await this.contextVotingPort().createAccount(username)
})

Given('{issueIdentifier} exists', async function createAccount(issueIdentifier) {
  await this.contextVotingPort().createAccount(issueIdentifier)
})

Given('{username} has {int} votes', async function creditAccount(username, amount) {
  await this.contextVotingPort().creditAccount(username, amount)
})

Given('{issueIdentifier} has {int} votes', async function creditAccount(issueIdentifier, amount) {
  await this.contextVotingPort().creditAccount(issueIdentifier, amount)
})

When('{username} votes {int} on {issueIdentifier}', async function(username, amount, issueIdentifier) {
  await this.actionVotingPort().transfer(username, issueIdentifier, amount)
})

Then('{issueIdentifier} should have {int} votes', async function(issueIdentifier, expectedBalance) {
  const account = await this.outcomeVotingPort().getAccount(issueIdentifier)
  assert.equal(account.balance, expectedBalance)
})

Then('{username} should have {int} votes left', async function(username, expectedBalance) {
  const account = await this.outcomeVotingPort().getAccount(username)
  assert.equal(account.balance, expectedBalance)
})
const assert = require('assert')
const { Given, When, Then } = require('cucumber')
const Account = require('../../lib/domain/entities/Account')

Given('{username} exists', async function createAccount(username) {
  await this.votingPort().createAccount(username)
})

Given('{issueIdentifier} exists', async function createAccount(issueIdentifier) {
  await this.votingPort().createAccount(issueIdentifier)
})

Given('{username} has {int} votes', async function creditAccount(username, amount) {
  await this.votingPort().creditAccount(username, amount)
})

Given('{issueIdentifier} has {int} votes', async function creditAccount(issueIdentifier, amount) {
  await this.votingPort().creditAccount(issueIdentifier, amount)
})

When('{username} votes {int} on {issueIdentifier}', async function(username, amount, issueIdentifier) {
  await this.votingPort().transfer(username, issueIdentifier, amount)
})

Then('{issueIdentifier} should have {int} votes', async function(issueIdentifier, expectedBalance) {
  const balance = await this.votingPort().getBalance(issueIdentifier)
  assert.equal(balance, expectedBalance)
})

Then('{username} should have {int} votes left', async function(username, expectedBalance) {
  const balance = await this.votingPort().getBalance(username)
  assert.equal(balance, expectedBalance)
})
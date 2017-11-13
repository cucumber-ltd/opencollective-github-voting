const assert = require('assert')
const { Given, When, Then } = require('cucumber')
const { Account } = require('../../lib/domain/entities')

Given('{username} exists', async function createAccount(username) {
  await this.votingPort().createUser(username)
})

Given('{issueIdentifier} exists', async function createAccount(issueIdentifier) {
  await this.votingPort().createIssue(issueIdentifier)
})

Given('{username} has {int} votes', async function creditAccount(username, amount) {
  await this.votingPort().creditUser(username, amount)
})

Given('{issueIdentifier} has {int} votes', async function creditAccount(issueIdentifier, amount) {
  await this.votingPort().creditIssue(issueIdentifier, amount)
})

When('{username} votes {int} on {issueIdentifier}', async function(username, amount, issueIdentifier) {
  await this.votingPort().vote(username, issueIdentifier, amount)
})

Then('{issueIdentifier} should have {int} votes', async function(issueIdentifier, expectedBalance) {
  const balance = await this.votingPort().getIssueVotes(issueIdentifier)
  assert.equal(balance, expectedBalance)
})

Then('{username} should have {int} votes left', async function(username, expectedBalance) {
  const balance = await this.votingPort().getUserVotes(username)
  assert.equal(balance, expectedBalance)
})
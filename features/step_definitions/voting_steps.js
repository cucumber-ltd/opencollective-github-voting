const assert = require('assert')
const uuid = require('uuid/v4')
const { Before, Given, When, Then } = require('cucumber')
const { TransferCommand } = require('../../lib/domain/commands')
const { Account } = require('../../lib/domain/entities')

Before(function() {
  const accountsByUid = new Map()
  this._accountUid = name => {
    if (!accountsByUid.has(name))
      accountsByUid.set(name, uuid())
    return accountsByUid.get(name)
  }
})

Given('{issueIdentifier} exists', async function createAccount(issueIdentifier) {
  await Account.create(this._accountUid(issueIdentifier), this.eventStore())
})

Given('{username} exists', async function createAccount(username) {
  await Account.create(this._accountUid(username), this.eventStore())
})

Given('{username} has {int} votes', async function creditAccount(username, amount) {
  const account = await this.repository().load(Account, this._accountUid(username))
  await account.credit(amount)
})

Given('{issueIdentifier} has {int} votes', async function creditAccount(issueIdentifier, amount) {
  const account = await this.repository().load(Account, this._accountUid(issueIdentifier))
  await account.credit(amount)
})

When('{username} votes {int} on {issueIdentifier}', async function(username, amount, issueIdentifier) {
  const fromAccountUid = this._accountUid(username)
  const toAccountUid = this._accountUid(issueIdentifier)
  await this.commandBus().dispatchCommand(new TransferCommand({ fromAccountUid, toAccountUid, amount }))
})

Then('{issueIdentifier} should have {int} votes', async function(issueIdentifier, count) {
  const issueAccount = await this.repository().load(Account, this._accountUid(issueIdentifier))
  assert.equal(issueAccount._balance, count)
})

Then('{username} should have {int} votes left', async function(username, count) {
  const userAccount = await this.repository().load(Account, this._accountUid(username))
  assert.equal(userAccount._balance, count)
})
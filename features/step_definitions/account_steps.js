const assert = require('assert')
const uuid = require('uuid/v4')
const { Given, When, Then } = require('cucumber')

Given('the {accountNumber} account exists', async function(accountNumber) {
  await this.contextAccountCommands.createAccount(accountNumber)
})

Given("the {accountNumber} balance is {int}", async function(accountNumber, balance) {
  const uniqueReference = uuid()
  await this.contextAccountCommands.creditAccount(accountNumber, balance, uniqueReference)
})

When('{int} is transferred from {accountNumber} to {accountNumber}', async function(amount, fromAccountNumber, toAccountNumber) {
  const subscription = await this.actionSub.subscribe('ACCOUNTS', async () => {
  })
  await this.pub.flushScheduledSignals(true)
  await subscription.delivered(1)
  await this.actionTransferCommands.transfer(fromAccountNumber, toAccountNumber, amount)
})

Then('the {accountNumber} balance should be {int}', async function(accountNumber, expectedBalance) {
  const subscription = await this.outcomeSub.subscribe('ACCOUNTS', async () => {
    const account = await this.outcomeAccountQueries.getAccount(accountNumber)
    assert.equal(account.balance, expectedBalance)
  })

  await this.pub.flushScheduledSignals(true)
  await subscription.delivered(1)
})

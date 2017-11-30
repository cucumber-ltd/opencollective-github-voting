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
  await this.actionTransferCommands.transfer(fromAccountNumber, toAccountNumber, amount)
})

Then('the {accountNumber} balance should be {int}', async function(accountNumber, expectedBalance) {
  const subscriptionKey = {
    type: 'accountNumber',
    filter: accountNumber
  }

  const subscription = await this.accountQueries.subscribe(subscriptionKey, async () => {
    const account = await this.accountQueries.getAccount(accountNumber)
    assert.equal(account.balance, expectedBalance)
  })

  // Even though we're in a When step, use the pubSub from Given/When
  await this.pubSub.flushScheduledSignals(true)
  await subscription.delivered(1)
})

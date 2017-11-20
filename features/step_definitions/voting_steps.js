const assert = require('assert')
const { Given, When, Then } = require('cucumber')

Given('the {accountNumber} account exists', async function(accountNumber) {
  await this.contextAccountCommands.createAccount(accountNumber)
})

Given("the {accountNumber} balance is {int}", async function(accountNumber, balance) {
  await this.contextAccountCommands.creditAccount(accountNumber, balance)
})

When('{int} is transferred from {accountNumber} to {accountNumber}', async function(amount, fromAccountNumber, toAccountNumber) {
  await this.actionTransferCommands.transfer(fromAccountNumber, toAccountNumber, amount)
})

Then('the {accountNumber} balance should be {int}', async function(accountNumber, expectedBalance) {
  const account = await this.outcomeAccountQueries.getAccount(accountNumber)
  assert.equal(account.balance, expectedBalance)
})

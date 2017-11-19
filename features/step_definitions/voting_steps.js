const assert = require('assert')
const { Given, When, Then } = require('cucumber')
const Account = require('../../lib/domain/entities/Account')

Given('the {accountNumber} account exists', async function(accountNumber) {
  await this.contextVotingPort.createAccount(accountNumber)
})

Given("the {accountNumber} balance is {int}", async function(accountNumber, balance) {
  await this.contextVotingPort.creditAccount(accountNumber, balance)
})

When('{int} is transferred from {accountNumber} to {accountNumber}', async function(amount, fromAccountNumber, toAccountNumber) {
  await this.actionVotingPort.transfer(fromAccountNumber, toAccountNumber, amount)
})

Then('the {accountNumber} balance should be {int}', async function(accountNumber, expectedBalance) {
  const account = await this.outcomeAccountStore.getAccount(accountNumber)
  assert.equal(account.balance, expectedBalance)
})

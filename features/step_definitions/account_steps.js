const assert = require('assert')
const uuid = require('uuid/v4')
const { Given, When, Then } = require('cucumber')

Given('{accountHolder} has a {currency} account with balance {int}', async function(accountHolder, currency, initialBalance) {
  const accountHolderId = this.id(accountHolder)
  const accountId = this.id(`${accountHolder}-${currency}`)

  await this.context.accountCommands.createAccount({
    accountId,
    currency,
    initialBalance
  })

  await this.context.accountCommands.creditAccount({
    accountId,
    amount: initialBalance,
    uniqueReference: uuid()
  })

  await this.context.accountHolderCommands.createAccountHolder({
    accountHolderId,
    name: accountHolder
  })

  await this.context.accountHolderCommands.grantAccountAccess({
    accountHolderId,
    accountId
  })
})

When('{accountHolder} transfers {int} {currency} to {accountHolder}', async function(fromAccountHolder, amount, currency, toAccountHolder) {
  const fromAccountId = this.id(`${fromAccountHolder}-${currency}`)
  const toAccountId = this.id(`${toAccountHolder}-${currency}`)
  const actor = await this.actor(fromAccountHolder)

  const subscription = await actor.sub.subscribe('BANK', async () => {
  })
  await this.context.pub.flushScheduledSignals(true)
  await subscription.delivered(1)
  await actor.transferCommands.transfer({ fromAccountId, toAccountId, amount })
})

Then("{accountHolder}'s {currency} balance should be {int}", async function(accountHolder, currency, balance) {
  const accountId = this.id(`${accountHolder}-${currency}`)
  const actor = await this.actor(accountHolder)

  const subscription = await actor.sub.subscribe('BANK', async () => {
    const account = await actor.bankQueries.getAccount(accountId)
    assert.equal(account.balance, balance)
  })

  await this.context.pub.flushScheduledSignals(true)
  await subscription.delivered(1)
})

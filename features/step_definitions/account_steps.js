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

  await actor.transferCommands.transfer({ fromAccountId, toAccountId, amount })
})

Then("{accountHolder}'s {currency} balance should be {int}", async function(accountHolder, currency, balance) {
  const accountId = this.id(`${accountHolder}-${currency}`)
  const actor = await this.actor(accountHolder)

  // TODO: this code is confusing as hell. How can we sync on signals in a simpler way?
  // The problem here is that we're running this step twice. The first time we need to
  // sync on the signal, but the 2nd time we don't have to. Also, it would be nice not having
  // to keep track of how many subscription deliveries to wait for. I kind of just want to say:
  // "wait until all scheduled signals have been propagated and consumed" and not worry about
  // where they are sent from or where they are consumed.

  let account
  const getAccount = async () => {
    account = await actor.bankQueries.getAccount(accountId)
  }
  try {
    await getAccount()
    assert.equal(account.balance, balance)
  } catch (err) {
    const subscription = await actor.sub.subscribe('BANK', getAccount)
    await this.context.pub.scheduled('BANK')
    await this.context.pub.flushScheduledSignals()
    await subscription.delivered(1)
    assert.equal(account.balance, balance)
  }
})

const assert = require('assert')
const { Given, When, Then } = require('cucumber')

Given('{gitHubUser} has a {currency} account with balance {int}', async function(gitHubUser, currency, initialBalance) {
  const accountHolderId = this.id(gitHubUser)
  const accountId = this.id(`${gitHubUser}-${currency}`)

  await this.context.accountCommands.createAccount({
    accountId,
    currency,
    initialBalance
  })

  await this.context.accountHolderCommands.createAccountHolder({
    accountHolderId,
  })

  await this.context.accountHolderCommands.grantAccountAccess({
    accountHolderId,
    accountId
  })

  await this.context.accountHolderCommands.linkAccountHolderToGitHubUser({
    accountHolderId,
    gitHubUser
  })
})

Given('{issue} has a {currency} account with balance {int}', async function(issue, currency, initialBalance) {
  const accountHolderId = this.id(issue)
  const accountId = this.id(`${issue}-${currency}`)

  await this.context.accountCommands.createAccount({
    accountId,
    currency,
    initialBalance
  })

  await this.context.accountHolderCommands.createAccountHolder({
    accountHolderId,
  })

  await this.context.accountHolderCommands.grantAccountAccess({
    accountHolderId,
    accountId
  })
})

When('{gitHubUser} transfers {int} {currency} to {issue}', async function(gitHubUser, amount, currency, issue) {
  const fromAccountId = this.id(`${gitHubUser}-${currency}`)
  const toAccountId = this.id(`${issue}-${currency}`)
  const actor = await this.actor(gitHubUser)

  await actor.transferCommands.transfer({ fromAccountId, toAccountId, amount })
})

Then("{gitHubUser}'s {currency} balance should be {int}", async function(gitHubUser, currency, balance) {
  const accountId = this.id(`${gitHubUser}-${currency}`)
  const actor = await this.actor(gitHubUser)

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
    await this.context.pub.published('BANK')
    await this.context.pub.flush()
    await subscription.delivered(1)
    assert.equal(account.balance, balance)
  }
})

Then("{issue}'s {currency} balance should be {int}", async function(issue, currency, balance) {
  const accountId = this.id(`${issue}-${currency}`)
  const actor = await this.actor(issue)

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
    await this.context.pub.published('BANK')
    await this.context.pub.flush()
    await subscription.delivered(1)
    assert.equal(account.balance, balance)
  }
})

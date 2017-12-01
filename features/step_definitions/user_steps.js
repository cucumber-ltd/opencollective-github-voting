const assert = require('assert')
const { When, Then } = require('cucumber')

When('{username} signs up', async function(username) {
  await this.actionUserCommands.createUser(username)
})

Then('{username}\'s statement should be:', async function(username, statementTable) {
  const expectedStatement = statementTable.hashes().map(row => {
    return {
      accountNumber: { number: row.number, currency: row.currency },
      balance: parseInt(row.balance)
    }
  })

  const user = await this.outcomeAccountQueries.getUser(username)
  const statement = user.accounts.map(account => {
    return {
      accountNumber: account.accountNumber,
      balance: account.balance
    }
  })
  assert.deepEqual(statement, expectedStatement)
})
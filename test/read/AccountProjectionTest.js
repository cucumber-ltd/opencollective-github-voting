const assert = require('assert')
const AccountProjection = require('../../lib/read/AccountProjection')
const AccountQueries = require('../../lib/read/AccountQueries')

describe('AccountProjection', () => {

  let projection, queries
  beforeEach(() => {
    // We're using a real instance rather than a mock, because the queries interface is too cumbersome to mock
    queries = new AccountQueries()
    projection = new AccountProjection(queries)
  })

  it('updates account balance on credit and debit', async () => {
    const accountNumber = { owner: '@aslak', currency: 'votes' }
    await projection.onAccountCreatedEvent({ entityUid: '1', accountNumber })
    await projection.onAccountCreditedEvent({ entityUid: '1', amount: 30 })
    await projection.onAccountDebitedEvent({ entityUid: '1', amount: 9 })
    await projection.onAccountCreditedEvent({ entityUid: '1', amount: 11 })

    const account = await queries.getAccount(accountNumber)
    assert.deepEqual(account, {
      accountNumber: { owner: '@aslak', currency: 'votes' },
      balance: 32,
    })
  })
})
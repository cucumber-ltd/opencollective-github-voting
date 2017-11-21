const assert = require('assert')
const AccountProjection = require('../../lib/read/AccountProjection')
const AccountQueries = require('../../lib/read/AccountQueries')

describe('AccountProjection', () => {
  const accountNumber = { owner: '@aslak', currency: 'votes' }

  let projection, queries
  beforeEach(async () => {
    // We're using a real instance rather than a mock, because the queries interface is too cumbersome to mock
    queries = new AccountQueries()
    projection = new AccountProjection(queries)

    await projection.onAccountCreatedEvent({ entityUid: '1', accountNumber })
    await projection.onAccountCreditedEvent({ entityUid: '1', amount: 30, uniqueReference: 'ref-100' })
    await projection.onAccountDebitedEvent({ entityUid: '1', amount: 9, uniqueReference: 'ref-101' })
    await projection.onAccountCreditedEvent({ entityUid: '1', amount: 11, uniqueReference: 'ref-102' })
  })

  it('updates account balance and stores transactions', async () => {
    const account = await queries.getAccount(accountNumber)
    assert.deepEqual(account, {
      accountNumber: { owner: '@aslak', currency: 'votes' },
      balance: 32,
      transactions: [
        {
          amount: 30,
          uniqueReference: "ref-100",
          type: "credit",
        },
        {
          amount: 9,
          uniqueReference: "ref-101",
          type: "debit",
        },
        {
          amount: 11,
          uniqueReference: "ref-102",
          type: "credit",
        }
      ]
    })
  })
})
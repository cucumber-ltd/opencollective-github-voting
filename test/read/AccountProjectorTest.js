const assert = require('assert')
const AccountProjector = require('../../lib/read/AccountProjector')
const AccountQueries = require('../../lib/read/AccountQueries')

describe('AccountProjector', () => {
  const accountNumber = { number: '@aslak', currency: 'votes' }

  let projector, queries
  beforeEach(async () => {
    // We're using a real instance rather than a mock, because the queries interface is too cumbersome to mock
    queries = new AccountQueries()
    projector = new AccountProjector(queries)

    await projector.onAccountCreatedEvent({ entityUid: '1', accountNumber })
    await projector.onAccountCreditedEvent({ entityUid: '1', amount: 30, uniqueReference: 'ref-100' })
    await projector.onAccountDebitedEvent({ entityUid: '1', amount: 9, uniqueReference: 'ref-101' })
    await projector.onAccountCreditedEvent({ entityUid: '1', amount: 11, uniqueReference: 'ref-102' })
  })

  it('updates account balance and stores transactions', async () => {
    const account = await queries.getAccount(accountNumber)
    assert.deepEqual(account, {
      accountNumber: { number: '@aslak', currency: 'votes' },
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
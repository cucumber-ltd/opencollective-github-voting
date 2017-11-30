const assert = require('assert')
const SigSub = require('../../lib/cqrs-lite/sigsub/SigSub')
const AccountProjector = require('../../lib/read/AccountProjector')
const AccountQueries = require('../../lib/read/AccountQueries')

describe('AccountProjector', () => {
  const username = '@aslak'
  const userUid = 'user-1'
  const accountUid = 'account-1'
  const accountNumber = { number: '@aslak-votes', currency: 'votes' }

  let projector, queries, sigSub
  beforeEach(async () => {
    sigSub = new SigSub()
    // We're using a real instance rather than a mock, because the queries interface is too cumbersome to mock
    queries = new AccountQueries(sigSub)
    projector = new AccountProjector(queries)

    await projector.onUserCreatedEvent({ entityUid: userUid, username })
    await projector.onAccountCreatedEvent({ entityUid: accountUid, accountNumber })
    await projector.onAccountAssignedToUserEvent({ entityUid: accountUid, userUid })

    await projector.onAccountCreditedEvent({ entityUid: accountUid, amount: 30, uniqueReference: 'ref-100' })
    await projector.onAccountDebitedEvent({ entityUid: accountUid, amount: 9, uniqueReference: 'ref-101' })
    await projector.onAccountCreditedEvent({ entityUid: accountUid, amount: 11, uniqueReference: 'ref-102' })
    await sigSub.flushScheduledSignals()
  })

  it('updates account balance and stores transactions', async () => {
    const account = await queries.getAccount(accountNumber)
    assert.deepEqual(account, {
      accountNumber: { number: '@aslak-votes', currency: 'votes' },
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
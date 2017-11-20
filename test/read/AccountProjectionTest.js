const assert = require('assert')
const sinon = require('sinon')
const AccountProjection = require('../../lib/read/AccountProjection')
const AccountQueries = require('../../lib/read/AccountQueries')

// TODO: Split up in projection and store tests? Or is it more pragmatic to test them together?

describe('AccountProjection', () => {

  let projection, queries
  beforeEach(() => {
    queries = new AccountQueries()
    projection = new AccountProjection(queries)
  })

  it('signals accountUpdated on creation', async () => {
    const accountCreated = sinon.spy()
    const entityUid = '123'
    const accountNumber = { owner: '@aslak', currency: 'votes' }

    queries.on('accountUpdated', accountCreated)
    await projection.onAccountCreatedEvent({ entityUid, accountNumber })
    assert(accountCreated.calledWith(accountNumber))
  })

  it('signals accountUpdated on balance update', async () => {
    const accountUpdated = sinon.spy()
    const entityUid = '123'
    const accountNumber = { owner: '@aslak', currency: 'votes' }

    await projection.onAccountCreatedEvent({ entityUid, accountNumber })
    queries.on('accountUpdated', accountUpdated)
    await projection.onAccountCreditedEvent({ entityUid, amount: 22 })
    assert(accountUpdated.calledWith(accountNumber))
  })

  it('lists accounts by currency, highest balance first', async () => {
    await projection.onAccountCreatedEvent({ entityUid: '1', accountNumber: { owner: '@aslak', currency: 'votes' } })
    await projection.onAccountCreditedEvent({ entityUid: '1', amount: 22 })

    await projection.onAccountCreatedEvent({ entityUid: '2', accountNumber: { owner: '@aslak', currency: 'dollars' } })
    await projection.onAccountCreditedEvent({ entityUid: '2', amount: 32 })

    await projection.onAccountCreatedEvent({ entityUid: '3', accountNumber: { owner: '@matt', currency: 'votes' } })
    await projection.onAccountCreditedEvent({ entityUid: '3', amount: 42 })

    const accounts = await queries.getAccounts('votes')
    assert.deepEqual(accounts, [
      {
        accountNumber: { owner: '@matt', currency: 'votes' },
        balance: 42,
      },
      {
        accountNumber: { owner: '@aslak', currency: 'votes' },
        balance: 22,
      }
    ])
  })
})
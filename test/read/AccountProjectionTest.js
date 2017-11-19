const assert = require('assert')
const sinon = require('sinon')
const AccountProjection = require('../../lib/read/AccountProjection')
const AccountStore = require('../../lib/read/AccountStore')

// TODO: Split up in projection and store tests? Or is it more pragmatic to test them together?

describe('AccountProjection', () => {

  let projection, store
  beforeEach(() => {
    store = new AccountStore()
    projection = new AccountProjection(store)
  })

  it('signals accountUpdated on creation', async () => {
    const accountCreated = sinon.spy()
    const entityUid = '123'
    const accountNumber = { owner: '@aslak', currency: 'votes' }

    store.on('accountUpdated', accountCreated)
    await projection.onAccountCreatedEvent({ entityUid, accountNumber })
    assert(accountCreated.calledWith(accountNumber))
  })

  it('signals accountUpdated on balance update', async () => {
    const accountUpdated = sinon.spy()
    const entityUid = '123'
    const accountNumber = { owner: '@aslak', currency: 'votes' }

    await projection.onAccountCreatedEvent({ entityUid, accountNumber })
    store.on('accountUpdated', accountUpdated)
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

    const accounts = await store.getAccounts('votes')
    assert.deepEqual(accounts, [
      {
        accountNumber: { owner: '@matt', currency: 'votes' },
        balance: 42,
        uid: 3
      },
      {
        accountNumber: { owner: '@aslak', currency: 'votes' },
        balance: 22,
        uid: 1
      }
    ])
  })
})
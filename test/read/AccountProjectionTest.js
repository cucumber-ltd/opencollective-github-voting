const assert = require('assert')
const sinon = require('sinon')
const AccountProjection = require('../../lib/read/AccountProjection')

describe('AccountProjection', () => {
  it('signals accountCreated', () => {
    const accountCreated = sinon.spy()
    const projection = new AccountProjection({
      accountCreated
    })
    const entityUid = '123'
    const accountNumber = { owner: '@aslak', currency: 'votes' }

    projection.onAccountCreatedEvent({ entityUid, accountNumber })
    assert(accountCreated.calledWith(accountNumber))
  })

  it('signals accountUpdated', () => {
    const accountUpdated = sinon.spy()
    const projection = new AccountProjection({
      accountCreated: sinon.spy(),
      accountUpdated,
    })
    const entityUid = '123'
    const accountNumber = { owner: '@aslak', currency: 'votes' }

    projection.onAccountCreatedEvent({ entityUid, accountNumber })
    projection.onAccountCreditedEvent({ entityUid, amount: 22 })
    assert(accountUpdated.calledWith(accountNumber))
  })
})
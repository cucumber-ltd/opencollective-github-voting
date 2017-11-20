const assert = require('assert')
const AccountQueries = require('../../lib/read/AccountQueries')

// TODO: Split up in projection and store tests? Or is it more pragmatic to test them together?

describe('AccountQueries', () => {

  let queries
  beforeEach(() => {
    queries = new AccountQueries()
  })

  xit('signals accountUpdated on creation', async () => {
    const accountNumber = { owner: '@aslak', currency: 'votes' }
    const account = {
      uid: 'some-entity-uid',
      accountNumber,
      balance: 0
    }

    queries.on('accountUpdated', accountCreated)
    assert(accountCreated.calledWith(accountNumber))
  })
})
const assert = require('assert')
const PubSub = require('../infrastructure/pubsub/PubSub')
const AccountQueries = require('./AccountQueries')
const AccountProjector = require('./AccountProjector')

module.exports = function verifyContract(makeAccountQueries) {
  describe('AccountQueries contract', () => {

    const username = '@aslak'
    const userUid = 'user-1'
    const accountUid = 'account-1'
    const currency = 'votes'
    const accountNumber = { number: '@aslak-votes', currency }

    let pub, sub, accountStore, accountQueries, accountProjector
    beforeEach(async () => {
      const pubSub = new PubSub()
      accountStore = new AccountQueries({ pub: pubSub })
      accountProjector = new AccountProjector(accountStore)
      accountQueries = await makeAccountQueries({ sub: pubSub, accountQueries: accountStore })
      pub = sub = pubSub
    })

    it('lists accounts by currency, highest balance first', async () => {
      // Create a user with a votes account with balance 30
      await accountProjector.onUserCreatedEvent({ entityUid: userUid, username })
      await accountProjector.onAccountCreatedEvent({ entityUid: accountUid, accountNumber })
      await accountProjector.onAccountCreditedEvent({ entityUid: accountUid, amount: 30, uniqueReference: 'ref-100' })
      await accountProjector.onAccountDebitedEvent({ entityUid: accountUid, amount: 10, uniqueReference: 'ref-101' })
      await accountProjector.onAccountAssignedToUserEvent({ entityUid: accountUid, userUid })
      await pub.flushScheduledSignals()

      const accounts = await accountQueries.getAccounts(currency)
      assert.deepEqual(accounts, [
        {
          accountNumber,
          balance: 20,
          transactions: [
            {
              amount: 30,
              type: 'credit',
              uniqueReference: 'ref-100'
            },
            {
              amount: 10,
              type: 'debit',
              uniqueReference: 'ref-101'
            }
          ]
        }
      ])
    })
  })
}


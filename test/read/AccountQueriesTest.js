const assert = require('assert')
const PubSub = require('../../lib/cqrs-lite/pubsub/PubSub')
const AccountQueries = require('../../lib/read/AccountQueries')
const AccountProjector = require('../../lib/read/AccountProjector')
const verifyContract = require('./verifyAccountQueriesContract')

describe('AccountQueries', () => {
  verifyContract(async ({ pubSub, accountQueries }) => accountQueries)

  describe('Implementation-Specific', () => {

    const username = '@aslak'
    const userUid = 'user-1'
    const accountUid = 'account-1'
    const currency = 'votes'
    const accountNumber = { number: '@aslak-votes', currency }

    let pub, sub, accountQueries, accountProjector
    beforeEach(async () => {
      const pubSub = new PubSub()
      accountQueries = new AccountQueries({ pub: pubSub })
      accountProjector = new AccountProjector(accountQueries)
      pub = sub = pubSub
    })

    it('publishes when an account is stored', async () => {
      // Create a user with a votes account with balance 30
      await accountProjector.onUserCreatedEvent({ entityUid: userUid, username })
      await accountProjector.onAccountCreatedEvent({ entityUid: accountUid, accountNumber })
      await accountProjector.onAccountCreditedEvent({ entityUid: accountUid, amount: 30, uniqueReference: 'ref-100' })
      await accountProjector.onAccountAssignedToUserEvent({ entityUid: accountUid, userUid })
      await accountProjector.onAccountDebitedEvent({ entityUid: accountUid, amount: 10, uniqueReference: 'ref-101' })

      const subscription = await sub.subscribe('ACCOUNTS', async () => {
        const retrievedAccount = await accountQueries.getAccount(accountNumber)
        assert.equal(retrievedAccount.balance, 20)
      })
      await pub.flushScheduledSignals()
      await subscription.delivered(1)
    })
  })
})

const assert = require('assert')
const PubSub = require('../infrastructure/pubsub/PubSub')
const BankStore = require('./BankStore')
const BankProjector = require('./BankProjector')
const verifyContract = require('./verifyBankQueriesContract')

describe('BankQueries', () => {
  verifyContract(async ({ bankQueries }) => bankQueries)

  describe('Implementation-Specific', () => {

    const accountHolderName = '@aslak'
    const accountHolderId = 'user-1'
    const accountId = 'account-1'
    const currency = 'votes'

    let pub, sub, bankQueries, bankProjector
    beforeEach(async () => {
      const pubSub = new PubSub()
      const bankStore = new BankStore({ pub: pubSub })
      bankProjector = new BankProjector({ bankStore })
      bankQueries = bankStore.getQueries()
      pub = sub = pubSub

      // Create a user with a votes account with balance 30
      await bankProjector.onAccountCreated({ entityUid: accountId, currency })
      await bankProjector.onAccountCredited({ entityUid: accountId, amount: 30, uniqueReference: 'ref-100' })
      await bankProjector.onAccountDebited({ entityUid: accountId, amount: 10, uniqueReference: 'ref-101' })
      await bankProjector.onAccountHolderCreated({ entityUid: accountHolderId, name: accountHolderName })
      await bankProjector.onAccountAccessGranted({
        entityUid: accountHolderId,
        accountId
      })

    })

    it('publishes when an account is stored', async () => {
      const subscription = await sub.subscribe('BANK', async () => {
        const accountHolder = await bankQueries.getAccountHolder(accountHolderId)
        const account = accountHolder.accounts[0]
        assert.equal(account.balance, 20)
      })
      await pub.flushScheduledSignals()
      await subscription.delivered(1)
    })
  })
})

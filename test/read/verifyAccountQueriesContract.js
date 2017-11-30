const assert = require('assert')
const SigSub = require('../../lib/cqrs-lite/sigsub/SigSub')
const AccountQueries = require('../../lib/read/AccountQueries')

module.exports = function verifyContract(makeAccountQueries) {
  describe('AccountQueries contract', () => {

    let sigSub, accountStore, accountQueries
    beforeEach(async () => {
      sigSub = new SigSub()
      accountStore = new AccountQueries(sigSub)
      accountQueries = await makeAccountQueries({ sigSub, accountStore })
    })

    it('lists accounts by currency, highest balance first', async () => {
      await accountStore.storeAccount('aslak-votes-uid', {
        accountNumber: { number: '@aslak', currency: 'votes' },
        balance: 22,
      })
      await accountStore.storeAccount('aslak-dollars-uid', {
        accountNumber: { number: '@aslak', currency: 'dollars' },
        balance: 32,
      })
      await accountStore.storeAccount('matt-votes-uid', {
        accountNumber: { number: '@matt', currency: 'votes' },
        balance: 42,
      })

      const accounts = await accountQueries.getAccounts('votes')
      assert.deepEqual(accounts, [
        {
          accountNumber: { number: '@matt', currency: 'votes' },
          balance: 42,
        },
        {
          accountNumber: { number: '@aslak', currency: 'votes' },
          balance: 22,
        }
      ])
    })

    it('publishes signals for accountNumber subscriptions', async () => {
      const accountNumber = { number: '@aslak', currency: 'votes' }
      const account = {
        accountNumber,
        balance: 0
      }

      await accountStore.storeAccount('some-entity-uid', account)

      const subscriptionKey = {
        type: 'accountNumber',
        filter: accountNumber,
      }
      let retrievedAccount
      const subscription = await accountQueries.subscribe(subscriptionKey, async () => {
        retrievedAccount = await accountQueries.getAccount(accountNumber)
      })
      await sigSub.flushScheduledSignals()
      await subscription.delivered(1)
      assert.deepEqual(retrievedAccount, account)
    })

    it('publishes notifications for currency subscriptions', async () => {
      const currency = 'votes'
      const accountNumber = { number: '@aslak', currency }
      const account = {
        accountNumber,
        balance: 0
      }

      await accountStore.storeAccount('some-entity-uid', account)

      const subscriptionKey = {
        type: 'currency',
        filter: currency,
      }
      let retrievedAccount
      const subscription = await accountQueries.subscribe(subscriptionKey, async () => {
        retrievedAccount = await accountQueries.getAccount(accountNumber)
      })

      await sigSub.flushScheduledSignals()
      await subscription.delivered(1)
      assert.deepEqual(retrievedAccount, account)
    })
  })
}


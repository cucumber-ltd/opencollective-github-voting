const assert = require('assert')
const AccountQueries = require('../../lib/read/AccountQueries')

module.exports = function verifyContract(makeAccountQueries) {
  describe('AccountQueries contract', () => {

    let accountStore, accountQueries
    beforeEach(async () => {
      accountStore = new AccountQueries()
      accountQueries = await makeAccountQueries(accountStore)
    })

    it('lists accounts by currency, highest balance first', async () => {
      await accountStore.storeAccount('aslak-votes-uid', {
        accountNumber: { owner: '@aslak', currency: 'votes' },
        balance: 22,
      })
      await accountStore.storeAccount('aslak-dollars-uid', {
        accountNumber: { owner: '@aslak', currency: 'dollars' },
        balance: 32,
      })
      await accountStore.storeAccount('matt-votes-uid', {
        accountNumber: { owner: '@matt', currency: 'votes' },
        balance: 42,
      })

      const accounts = await accountQueries.getAccounts('votes')
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

    it('publishes notifications for accountNumber subscriptions', async () => {
      const accountNumber = { owner: '@aslak', currency: 'votes' }
      const account = {
        accountNumber,
        balance: 0
      }

      await accountStore.storeAccount('some-entity-uid', account)

      return new Promise((resolve, reject) => {
        const subscriptionKey = {
          type: 'accountNumber',
          filter: accountNumber,
        }
        accountQueries.subscribe(subscriptionKey, async () => {
          const retrievedAccount = await accountQueries.getAccount(accountNumber)
          assert.deepEqual(retrievedAccount, account)
          resolve()
        }).catch(reject)
      })
    })

    it('publishes notifications for currency subscriptions', async () => {
      const currency = 'votes'
      const accountNumber = { owner: '@aslak', currency }
      const account = {
        accountNumber,
        balance: 0
      }

      await accountStore.storeAccount('some-entity-uid', account)

      return new Promise((resolve, reject) => {
        const subscriptionKey = {
          type: 'currency',
          filter: currency,
        }
        accountQueries.subscribe(subscriptionKey, async () => {
          const retrievedAccount = await accountQueries.getAccount(accountNumber)
          assert.deepEqual(retrievedAccount, account)
          resolve()
        }).catch(reject)
      })
    })
  })
}


const assert = require('assert')
const PubSub = require('../infrastructure/pubsub/PubSub')
const BankStore = require('./BankStore')
const BankProjector = require('./BankProjector')

module.exports = function verifyContract(makeBankQueries) {
  describe('BankQueries contract', () => {

    const accountHolderName = '@aslak'
    const accountHolderId = 'user-1'
    const accountId = 'account-1'
    const currency = 'votes'

    let pub, bankQueries, bankProjector
    beforeEach(async () => {
      const pubSub = new PubSub()
      const bankStore = new BankStore({ pub: pubSub })
      bankProjector = new BankProjector({ bankStore })
      bankQueries = await makeBankQueries({ sub: pubSub, bankQueries: bankStore.getQueries() })
      pub = pubSub

      // Create a user with a votes account with balance 30
      await bankProjector.onAccountCreated({ entityUid: accountId, currency, initialBalance: 0 })
      await bankProjector.onAccountCredited({ entityUid: accountId, amount: 30, uniqueReference: 'ref-100' })
      await bankProjector.onAccountDebited({ entityUid: accountId, amount: 10, uniqueReference: 'ref-101' })
      await bankProjector.onAccountHolderCreated({ entityUid: accountHolderId, name: accountHolderName })
      await bankProjector.onAccountAccessGranted({
        entityUid: accountHolderId,
        accountId
      })
      await pub.flush()
    })

    it('gets AccountHolder', async () => {
      const accountHolder = await bankQueries.getAccountHolder(accountHolderId)
      assert.deepEqual(accountHolder, {
        id: accountHolderId,
        name: accountHolderName,
        accounts: [
          {
            id: accountId,
            currency,
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
        ]
      })
    })

    it('gets AccountHolders', async () => {
      const accountHolders = await bankQueries.getAccountHolders()
      const accountHolderNames = accountHolders.map(accountHolder => accountHolder.name)
      assert.deepEqual(accountHolderNames, [accountHolderName])
    })
  })
}


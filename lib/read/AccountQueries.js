const stringify = require('json-stable-stringify')

module.exports = class AccountQueries {
  constructor() {
    this._subscribersBySubscriptionKey = new Map()
    this._accountByAccountNumber = new Map()
    this._accountsByCurrency = new Map()

    // Write interface
    this._accountByEntityUid = new Map()
    this._accountUidByAccountNumber = new Map()
  }

  // Query interface

  async getAccount(accountNumber) {
    return this._accountByAccountNumber.get(accountNumberKey(accountNumber))
  }

  async getAccounts(currency) {
    const accounts = this._accountsByCurrency.get(currency) || []
    return [...accounts].sort((a, b) => {
      return b.balance - a.balance
    })
  }

  async subscribe(subscriptionKey, subscriber) {
    this._getSubscribers(subscriptionKey).add(subscriber)
    await subscriber()
  }

  _getSubscribers(subscriptionKey) {
    const key = stringify(subscriptionKey)
    if(!this._subscribersBySubscriptionKey.has(key))
      this._subscribersBySubscriptionKey.set(key, new Set())
    return this._subscribersBySubscriptionKey.get(key)
  }

  async _publishSubscribers(subscriptionKey) {
    for (const subscriber of [...this._getSubscribers(subscriptionKey)]) {
      await subscriber()
    }
  }

  // Write interface

  async storeAccount(entityUid, account) {
    const key = accountNumberKey(account.accountNumber)
    this._accountByEntityUid.set(entityUid, account)
    this._accountUidByAccountNumber.set(key, entityUid)

    this._accountByAccountNumber.set(key, account)
    if (!this._accountsByCurrency.has(account.accountNumber.currency))
      this._accountsByCurrency.set(account.accountNumber.currency, new Set())
    this._accountsByCurrency.get(account.accountNumber.currency).add(account)

    await this._publishSubscribers({
      type: 'currency',
      filter: account.accountNumber.currency
    })

    await this._publishSubscribers({
      type: 'accountNumber',
      filter: account.accountNumber
    })
  }

  async getAccountByEntityUid(entityUid) {
    return this._accountByEntityUid.get(entityUid)
  }

  async getAccountUidByAccountNumber(accountNumber) {
    const key = accountNumberKey(accountNumber)
    return this._accountUidByAccountNumber.get(key)
  }
}

function accountNumberKey({ owner, currency }) {
  if (!owner) throw new Error('Missing owner')
  if (!currency) throw new Error('Missing currency')
  return `${owner}:${currency}`
}
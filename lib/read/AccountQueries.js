module.exports = class AccountQueries {
  constructor(sigSub) {
    if(!sigSub) throw new Error('No sigSub')
    this._sigSub = sigSub

    this._accountByAccountNumber = new Map()
    this._accountsByCurrency = new Map()

    // Write interface
    this._userByEntityUid = new Map()
    this._userUidByUsername = new Map()

    this._accountByEntityUid = new Map()
    // TODO: Get rid of (unstable)
    this._accountUidByAccountNumber = new Map()
  }

  // Query interface

  async subscribe(subscriptionKey, subscriber) {
    return this._sigSub.subscribe(subscriptionKey, subscriber)
  }

  async getUser(username) {
    const entityUid = this._userUidByUsername.get(username)
    return this._userByEntityUid.get(entityUid)
  }

  // TODO: Use UID
  async getAccount(accountNumber) {
    return this._accountByAccountNumber.get(accountNumberKey(accountNumber))
  }

  async getAccounts(currency) {
    const accounts = this._accountsByCurrency.get(currency) || []
    return [...accounts].sort((a, b) => {
      return b.balance - a.balance
    })
  }

  // Write interface

  async storeUser(entityUid, user) {
    this._userByEntityUid.set(entityUid, user)
    this._userUidByUsername.set(user.username, entityUid)
  }

  async storeAccount(entityUid, account) {
    this._accountByEntityUid.set(entityUid, account)
    const key = accountNumberKey(account.accountNumber)
    this._accountUidByAccountNumber.set(key, entityUid)

    this._accountByAccountNumber.set(key, account)
    if (!this._accountsByCurrency.has(account.accountNumber.currency))
      this._accountsByCurrency.set(account.accountNumber.currency, new Set())
    this._accountsByCurrency.get(account.accountNumber.currency).add(account)

    this._sigSub.scheduleSignal({
      type: 'currency',
      filter: account.accountNumber.currency
    })

    this._sigSub.scheduleSignal({
      type: 'accountNumber',
      filter: account.accountNumber
    })
  }

  async getAccountByEntityUid(entityUid) {
    return this._accountByEntityUid.get(entityUid)
  }

  async getUserByEntityUid(entityUid) {
    return this._userByEntityUid.get(entityUid)
  }

  async getAccountUidByAccountNumber(accountNumber) {
    const key = accountNumberKey(accountNumber)
    return this._accountUidByAccountNumber.get(key)
  }
}

function accountNumberKey({ number, currency }) {
  if (!number) throw new Error('Missing number')
  if (!currency) throw new Error('Missing currency')
  return `${number}:${currency}`
}
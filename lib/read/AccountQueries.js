const SIGNAL = 'ACCOUNTS'

module.exports = class AccountQueries {
  constructor({ pub, sub }) {
    if (!pub) throw new Error('No pub')
    // TODO: Remove
    if (sub) throw new Error('No sub expected')
    this._pub = pub
    this._sub = sub

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

  async getUser(username) {
    const entityUid = this._userUidByUsername.get(username)
    return this._userByEntityUid.get(entityUid)
  }

  // TODO: Use UID
  async getAccount(accountNumber) {
    return this._accountByAccountNumber.get(accountNumberKey(accountNumber))
  }

  // TODO: Deprecate - getUser should be used for issues too.
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

    this._pub.scheduleSignal(SIGNAL)
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
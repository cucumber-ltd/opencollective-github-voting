module.exports = class AccountQueries {
  constructor() {
    this._signals = {
      'accountUpdated': [],
    }
    this._accountByAccountNumber = new Map()
    this._accountsByCurrency = new Map()

    // Write interface
    this._accountByEntityUid = new Map()
  }

  // Query interface

  on(signalName, signalHandler) {
    this._signals[signalName].push(signalHandler)
  }

  async getAccount(accountNumber) {
    const account = this._accountByAccountNumber.get(accountNumberKey(accountNumber))
    if (!account) throw new Error(`No account found for ${accountNumberKey(accountNumber)}. I have: ${Array.from(this._accountByAccountNumber.keys())}`)
    return account
  }

  async getAccounts(currency) {
    return [...this._accountsByCurrency.get(currency)].sort((a, b) => {
      return b.balance - a.balance
    })
  }

  // Write interface

  async storeAccount(account) {
    this._accountByEntityUid.set(account.uid, account)
    this._accountByAccountNumber.set(accountNumberKey(account.accountNumber), account)
    if (!this._accountsByCurrency.has(account.accountNumber.currency))
      this._accountsByCurrency.set(account.accountNumber.currency, new Set())
    this._accountsByCurrency.get(account.accountNumber.currency).add(account)

    await this._emit('accountUpdated', account.accountNumber)

  }

  async getAccountByEntityUid(entityUid) {
    return this._accountByEntityUid.get(entityUid)
  }

  async _emit(signalName, value) {
    for (const handler of this._signals[signalName]) {
      await handler(value)
    }
  }
}

function accountNumberKey({ owner, currency }) {
  if (!owner) throw new Error('Missing owner')
  if (!currency) throw new Error('Missing currency')
  return `${owner}:${currency}`
}
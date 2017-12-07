const SIGNAL = 'BANK'

module.exports = class BankStore {
  constructor({ pub }) {
    if (!pub) throw new Error('No pub')
    this._pub = pub
    this._accountHolderById = new Map()
    this._accountById = new Map()
  }

  async storeAccountHolder(accountHolder) {
    this._accountHolderById.set(accountHolder.id, accountHolder)
    await this._pub.scheduleSignal(SIGNAL)
  }

  async storeAccount(account) {
    this._accountById.set(account.id, account)
    await this._pub.scheduleSignal(SIGNAL)
  }

  // Query interface

  _getAccountHolder(id) {
    return this._accountHolderById.get(id)
  }

  _getAccountHolders() {
    return [...this._accountHolderById.values()]
  }

  _getAccount(id) {
    return this._accountById.get(id)
  }

  getQueries() {
    return {
      getAccountHolder: this._getAccountHolder.bind(this),
      getAccountHolders: this._getAccountHolders.bind(this),
      getAccount: this._getAccount.bind(this)
    }
  }

}
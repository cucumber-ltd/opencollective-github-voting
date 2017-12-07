module.exports = class BankProjector {
  constructor({ bankStore }) {
    if (!bankStore) throw new Error('No bankStore')
    this._bankStore = bankStore
  }

  async onAccountHolderCreated({ entityUid, name }) {
    const accountHolder = {
      id: entityUid,
      name,
      accounts: []
    }
    await this._bankStore.storeAccountHolder(accountHolder)
  }

  async onAccountAccessGranted({ entityUid, accountId }) {
    const accountHolder = this._bankStore.getQueries().getAccountHolder(entityUid)
    const account = this._bankStore.getQueries().getAccount(accountId)
    accountHolder.accounts.push(account)
    await this._bankStore.storeAccountHolder(accountHolder)
  }

  async onAccountCreated({ entityUid, currency }) {
    const account = {
      id: entityUid,
      currency,
      balance: 0,
      transactions: []
    }
    await this._bankStore.storeAccount(account)
  }

  async onAccountCredited({ entityUid, amount, uniqueReference }) {
    if (isNaN(amount)) throw new Error("I don't like NaN")
    const account = this._bankStore.getQueries().getAccount(entityUid)
    account.transactions.push({
      type: 'credit',
      amount,
      uniqueReference
    })
    account.balance += amount
    await this._bankStore.storeAccount(account)
  }

  async onAccountDebited({ entityUid, amount, uniqueReference }) {
    const account = this._bankStore.getQueries().getAccount(entityUid)
    account.transactions.push({
      type: 'debit',
      amount,
      uniqueReference
    })
    account.balance -= amount
    await this._bankStore.storeAccount(account)
  }
}
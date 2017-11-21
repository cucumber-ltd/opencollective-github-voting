module.exports = class AccountProjector {
  constructor(accountStore) {
    if (!accountStore) throw new Error('no store')
    this._accountQueries = accountStore
  }

  async onAccountCreatedEvent({ entityUid, accountNumber }) {
    const account = {
      accountNumber,
      balance: 0,
      transactions: []
    }
    await this._accountQueries.storeAccount(entityUid, account)
  }

  async onAccountCreditedEvent({ entityUid, amount, uniqueReference }) {
    if (!uniqueReference) throw new Error('Missing uniqueReference')
    await this._addTransaction({ entityUid, type: 'credit', amount, uniqueReference })
  }

  async onAccountDebitedEvent({ entityUid, amount, uniqueReference }) {
    if (!uniqueReference) throw new Error('Missing uniqueReference')
    await this._addTransaction({ entityUid, type: 'debit', amount, uniqueReference })
  }

  async _addTransaction({ entityUid, type, amount, uniqueReference }) {
    const account = await this._accountQueries.getAccountByEntityUid(entityUid)
    if (type === 'credit') {
      account.balance += amount
    } else {
      account.balance -= amount
    }
    account.transactions.push({
      type,
      amount,
      uniqueReference
    })
    await this._accountQueries.storeAccount(entityUid, account)
  }
}

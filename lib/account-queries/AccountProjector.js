module.exports = class AccountProjector {
  constructor(accountQueries) {
    if (!accountQueries) throw new Error('No accountQueries')
    this._accountQueries = accountQueries
  }

  async onUserCreatedEvent({ entityUid, username }) {
    const user = {
      username,
      accounts: []
    }
    await this._accountQueries.storeUser(entityUid, user)
  }

  async onAccountCreatedEvent({ entityUid, accountNumber }) {
    const account = {
      accountNumber,
      balance: 0,
      transactions: []
    }
    await this._accountQueries.storeAccount(entityUid, account)
  }

  async onAccountAssignedToUserEvent({ entityUid, userUid }) {
    const account = await this._accountQueries.getAccountByEntityUid(entityUid)
    const user = await this._accountQueries.getUserByEntityUid(userUid)
    user.accounts.push(account)
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

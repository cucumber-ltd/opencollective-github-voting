// TODO: Rename to AccountProjector
module.exports = class AccountProjection {
  constructor(accountStore) {
    if (!accountStore) throw new Error('no store')
    this._accountQueries = accountStore
  }

  // Domain Events

  async onAccountCreatedEvent({ entityUid, accountNumber }) {
    const account = {
      uid: entityUid,
      accountNumber,
      balance: 0
    }
    await this._accountQueries.storeAccount(account)
  }

  async onAccountCreditedEvent({ entityUid, amount }) {
    await this._updateBalance(entityUid, amount)
  }

  async onAccountDebitedEvent({ entityUid, amount }) {
    await this._updateBalance(entityUid, -amount)
  }

  async _updateBalance(entityUid, amount) {
    const account = await this._accountQueries.getAccountByEntityUid(entityUid)
    account.balance += amount
    await this._accountQueries.storeAccount(account)
  }
}

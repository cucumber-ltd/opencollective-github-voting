module.exports = class AccountProjection {
  constructor() {
    this._accountsByAccountName = new Map()
    this._accountsByEntityUid = new Map()
  }

  // Events

  onAccountCreatedEvent({ entityUid, accountName }) {
    const account = {
      uid: entityUid,
      balance: 0
    }
    this._accountsByEntityUid.set(entityUid, account)
    this._accountsByAccountName.set(accountName, account)
  }

  onAccountCreditedEvent({ entityUid, amount }) {
    this._accountsByEntityUid.get(entityUid).balance += amount
  }

  onAccountDebitedEvent({ entityUid, amount }) {
    this._accountsByEntityUid.get(entityUid).balance -= amount
  }

  // Query

  getAccountByAccountName(accountName) {
    return this._accountsByAccountName.get(accountName)
  }
}
module.exports = class AccountProjection {
  constructor() {
    this._accountsByOwnerCurrencyKey = new Map()
    this._accountsByEntityUid = new Map()
  }

  // Events

  onAccountCreatedEvent({ entityUid, accountNumber }) {
    const account = {
      uid: entityUid,
      balance: 0
    }
    this._accountsByEntityUid.set(entityUid, account)
    this._accountsByOwnerCurrencyKey.set(key(accountNumber), account)
  }

  onAccountCreditedEvent({ entityUid, amount }) {
    this._accountsByEntityUid.get(entityUid).balance += amount
  }

  onAccountDebitedEvent({ entityUid, amount }) {
    this._accountsByEntityUid.get(entityUid).balance -= amount
  }

  // Query

  getAccount(accountNumber) {
    const account = this._accountsByOwnerCurrencyKey.get(key(accountNumber))
    if (!account) throw new Error(`No account found for ${key(accountNumber)}. I have: ${Array.from(this._accountsByOwnerCurrencyKey.keys())}`)
    return account
  }
}

function key({ owner, currency }) {
  if (!owner) throw new Error('Missing owner')
  if (!currency) throw new Error('Missing currency')
  return `${owner}:${currency}`
}
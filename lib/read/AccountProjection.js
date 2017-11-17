module.exports = class AccountProjection {
  constructor(signals) {
    if(!signals) throw new Error('missing signals')
    this._signals = signals
    this._accountsByOwnerCurrencyKey = new Map()
    this._accountsByEntityUid = new Map()
  }

  // Events

  async onAccountCreatedEvent({ entityUid, accountNumber }) {
    const account = {
      uid: entityUid,
      accountNumber,
      balance: 0
    }
    this._accountsByEntityUid.set(entityUid, account)
    this._accountsByOwnerCurrencyKey.set(key(accountNumber), account)
    await this._signals.accountCreated(accountNumber)
  }

  async onAccountCreditedEvent({ entityUid, amount }) {
    await this._updateBalance(entityUid, amount)
  }

  async onAccountDebitedEvent({ entityUid, amount }) {
    await this._updateBalance(entityUid, -amount)
  }

  async _updateBalance(entityUid, amount) {
    const account = this._accountsByEntityUid.get(entityUid)
    account.balance += amount
    await this._signals.accountUpdated(account.accountNumber)
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
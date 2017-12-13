const uuid = require('uuid/v4')
const Entity = require('../infrastructure/cqrs/Entity')
const Event = require('../infrastructure/cqrs/Event')

module.exports = class Account extends Entity {
  // Internal event handlers. Only ever called for own events.

  onAccountCreated({ currency, initialBalance }) {
    this._currency = currency
    this._balance = initialBalance
  }

  onAccountCredited({ amount }) {
    this._balance += amount
  }

  onAccountDebited({ amount }) {
    this._balance -= amount
  }

  // Domain logic

  async create({ currency, initialBalance }) {
    await this.trigger(AccountCreated, { currency, initialBalance })
  }

  async transfer({ amount, toAccount }) {
    const uniqueReference = uuid()
    await this.debit({ amount, uniqueReference: `${uniqueReference}-transfer-debit` })

    const exchangeRate = getExchangeRate(this._currency, toAccount._currency)
    const creditAmount = amount / exchangeRate

    await toAccount.credit({ amount: creditAmount, uniqueReference: `${uniqueReference}-transfer-credit` })
  }

  async debit({ amount, uniqueReference }) {
    if (!uniqueReference) throw new Error('Missing uniqueReference')
    if (this._balance - amount < 0) throw new Error(`Insufficient funds to debit ${amount} from account ${this._uid} with balance ${this._balance}`)
    await this.trigger(AccountDebited, { amount, uniqueReference })
  }

  async credit({ amount, uniqueReference }) {
    if (!uniqueReference) throw new Error('Missing uniqueReference')
    await this.trigger(AccountCredited, { amount, uniqueReference })
  }
}

class AccountEvent extends Event {
  get accountId() {
    return this.entityUid
  }
}

AccountEvent.properties = {}

class AccountCreated extends AccountEvent {
}

AccountCreated.properties = {
  currency: 'string',
  initialBalance: 'number',
}

class AccountCredited extends AccountEvent {
}

AccountCredited.properties = {
  amount: 'number',
  uniqueReference: 'string',
}

class AccountDebited extends AccountEvent {
}

AccountDebited.properties = {
  amount: 'number',
  uniqueReference: 'string',
}

// TODO: We only want exchange rates from commit-days to votes (for transfers between a holders' own accounts)
function getExchangeRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return 1
  if (`${fromCurrency}/${toCurrency}` === 'USD/votes') return 1 / 100
  throw new Error(`I don't have an exchange rate from ${fromCurrency} to ${toCurrency}`)
}

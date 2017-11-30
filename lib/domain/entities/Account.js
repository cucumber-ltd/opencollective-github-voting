const uuid = require('uuid/v4')
const Entity = require('../../cqrs-lite/Entity')
const {
  AccountAssignedToUserEvent,
  AccountCreatedEvent,
  AccountDebitedEvent,
  AccountCreditedEvent,
} = require('../events')

module.exports = class Account extends Entity {
  // Internal event handlers. Only ever called for own events.

  onAccountCreatedEvent({ accountNumber }) {
    this._balance = 0
    this._currency = accountNumber.currency
  }

  onAccountCreditedEvent({ amount }) {
    this._balance += amount
  }

  onAccountDebitedEvent({ amount }) {
    this._balance -= amount
  }

  // Domain logic

  async create({ accountNumber }) {
    await this.trigger(AccountCreatedEvent, { accountNumber })
  }

  async assignTo({ userUid }) {
    await this.trigger(AccountAssignedToUserEvent, { userUid })
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
    if (this._balance - amount < 0) throw new Error('Insufficient funds')
    await this.trigger(AccountDebitedEvent, { amount, uniqueReference })
  }

  async credit({ amount, uniqueReference }) {
    if (!uniqueReference) throw new Error('Missing uniqueReference')
    await this.trigger(AccountCreditedEvent, { amount, uniqueReference })
  }
}

function getExchangeRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return 1
  if (`${fromCurrency}/${toCurrency}` === 'USD/votes') return 1 / 100
  throw new Error(`I don't have an exchange rate from ${fromCurrency} to ${toCurrency}`)
}

const Entity = require('../../cqrs-lite/Entity')
const { AccountCreatedEvent, AccountDebitedEvent, AccountCreditedEvent } = require('../events')

function getExchangeRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return 1
  if (`${fromCurrency}/${toCurrency}` === 'dollars/votes') return 1/100
}

module.exports = class Account extends Entity {
  // TODO: Move
  static async create(uid, eventStore, { accountNumber }) {
    const account = new Account(uid, eventStore)
    await account.trigger(AccountCreatedEvent, { accountNumber })
  }

  constructor(uid, eventStore) {
    super(uid, eventStore)
  }

  get currency() {
    return this._currency
  }

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

  async transfer(amount, toAccount) {
    await this.debit(amount)

    const exchangeRate = getExchangeRate(this.currency, toAccount.currency)
    const creditAmount = amount / exchangeRate

    await toAccount.credit(creditAmount)
  }

  async debit(amount) {
    if (this._balance - amount < 0) throw new Error('Insufficient funds')
    await this.trigger(AccountDebitedEvent, { amount })
  }

  async credit(amount) {
    await this.trigger(AccountCreditedEvent, { amount })
  }
}

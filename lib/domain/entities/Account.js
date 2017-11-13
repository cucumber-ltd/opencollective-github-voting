const Entity = require('../../cqrs-lite/Entity')

const { AccountCreatedEvent, AccountDebitedEvent, AccountCreditedEvent } = require('../events')

module.exports = class Account extends Entity {
  static async create(uid, eventStore, eventAttributes) {
    const account = new Account(uid, eventStore)
    await account.trigger(AccountCreatedEvent, eventAttributes)
  }

  constructor(uid, eventStore) {
    super(uid, eventStore)
  }

  // Internal event handlers. Only ever called for own events.

  onAccountCreatedEvent({ accountName }) {
    this._accountName = accountName
    this._balance = 0
  }

  onAccountCreditedEvent({ amount }) {
    this._balance += amount
  }

  onAccountDebitedEvent({ amount }) {
    this._balance -= amount
  }

  async transfer(amount, toAccount) {
    if (this._balance - amount < 0) throw new Error('Insufficient funds')
    await this.debit(amount)
    await toAccount.credit(amount)
  }

  async debit(amount) {
    await this.trigger(AccountDebitedEvent, { amount })
  }

  async credit(amount) {
    await this.trigger(AccountCreditedEvent, { amount })
  }
}

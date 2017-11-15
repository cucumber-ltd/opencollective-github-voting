const Entity = require('../../cqrs-lite/Entity')

const { AccountCreatedEvent, AccountDebitedEvent, AccountCreditedEvent } = require('../events')

module.exports = class Account extends Entity {
  // TODO: Move
  static async create(uid, eventStore, { accountNumber }) {
    const account = new Account(uid, eventStore)
    await account.trigger(AccountCreatedEvent, { accountNumber })
  }

  constructor(uid, eventStore) {
    super(uid, eventStore)
  }

  // Internal event handlers. Only ever called for own events.

  onAccountCreatedEvent({}) {
    this._balance = 0
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
    await toAccount.credit(amount)
  }

  async debit(amount) {
    if (this._balance - amount < 0) throw new Error('Insufficient funds')
    await this.trigger(AccountDebitedEvent, { amount })
  }

  async credit(amount) {
    await this.trigger(AccountCreditedEvent, { amount })
  }
}

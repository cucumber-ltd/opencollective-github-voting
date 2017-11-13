const Entity = require('../infrastructure/Entity')

const { AccountCreatedEvent, AccountDebitedEvent, AccountCreditedEvent } = require('./events')

class Account extends Entity {
  static async create(uid, eventStore) {
    const account = new Account(uid, eventStore)
    await account.trigger(AccountCreatedEvent, {})
  }

  constructor(uid, eventStore) {
    super(uid, eventStore)
  }

  onAccountCreatedEvent() {
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

module.exports = {
  Account
}

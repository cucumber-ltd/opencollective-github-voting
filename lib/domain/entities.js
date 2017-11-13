class Entity {
  constructor(uid, eventStore) {
    this._uid = uid
    this._version = 0
    this._eventStore = eventStore
    if (!eventStore) throw new Error('NPE')
  }

  async trigger(EventCtor, data) {
    this._version++
    const event = new EventCtor(
      this._uid,
      this._version,
      new Date(),
      data
    )
    await this._eventStore.storeEvent(event)
    await this.applyEvent(event)
  }

  applyEvent(event) {
    const eventHandlerName = `on${event.constructor.name}`
    if (typeof this[eventHandlerName] === 'function') {
      this[eventHandlerName](event.data)
    }
    this._version = event.entityVersion
  }
}

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

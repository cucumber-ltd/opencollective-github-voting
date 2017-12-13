const Entity = require('../infrastructure/cqrs/Entity')
const Event = require('../infrastructure/cqrs/Event')

module.exports = class Account extends Entity {
  async create({ name }) {
    await this.trigger(AccountHolderCreated, { name })
  }

  async grantAccess({ accountId }) {
    await this.trigger(AccountAccessGranted, { accountId })
  }
}

class AccountHolderEvent extends Event {
  get accountId() {
    return this.entityUid
  }
}

class AccountHolderCreated extends AccountHolderEvent {
}
AccountHolderCreated.properties = { name: 'string' }

class AccountAccessGranted extends AccountHolderEvent {
}
AccountAccessGranted.properties = { accountId: 'string' }

const Entity = require('../infrastructure/cqrs/Entity')
const Event = require('../infrastructure/cqrs/Event')

class AccountHolderCreated extends Event {
}

class AccountAccessGranted extends Event {
}

module.exports = class Account extends Entity {
  async create({ name }) {
    await this.trigger(AccountHolderCreated, { name })
  }

  async grantAccess({ accountId }) {
    await this.trigger(AccountAccessGranted, { accountId })
  }

}

const Entity = require('../infrastructure/cqrs/Entity')
const Event = require('../infrastructure/cqrs/Event')

class UserCreatedEvent extends Event {
}

module.exports = class Account extends Entity {
  async create({ username }) {
    await this.trigger(UserCreatedEvent, { username })
  }
}

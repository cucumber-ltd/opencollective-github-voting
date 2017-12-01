const Entity = require('../cqrs-lite/Entity')
const Event = require('../cqrs-lite/Event')

class UserCreatedEvent extends Event {
}

module.exports = class Account extends Entity {
  async create({ username }) {
    await this.trigger(UserCreatedEvent, { username })
  }
}

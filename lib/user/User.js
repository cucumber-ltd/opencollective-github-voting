const Entity = require('../cqrs-lite/Entity')
const { UserCreatedEvent } = require('../domain/events')

module.exports = class Account extends Entity {
  async create({ username }) {
    await this.trigger(UserCreatedEvent, { username })
  }
}

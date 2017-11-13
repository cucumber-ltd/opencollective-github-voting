const EventDispatcher = require('./EventDispatcher')

module.exports = class Entity {
  constructor(uid, eventStore) {
    this._uid = uid
    this._version = 0
    this._eventStore = eventStore
    this._eventDispatcher = new EventDispatcher()
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
    this._eventDispatcher.dispatch(event, this)
    this._version = event.entityVersion
  }
}
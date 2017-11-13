module.exports = class Entity {
  constructor(uid, eventStore) {
    this._uid = uid
    this._version = 0
    this._eventStore = eventStore
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
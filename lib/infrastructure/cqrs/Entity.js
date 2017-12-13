const EventDispatcher = require('./EventDispatcher')

module.exports = class Entity {
  constructor(uid, eventStore) {
    if (!uid) throw new Error('Missing uid')
    this._uid = uid
    this._version = 0
    this._eventStore = eventStore
    this._eventDispatcher = new EventDispatcher(this)
  }

  async trigger(EventCtor, data) {
    if (!EventCtor) throw new Error(`The event type is not valid (${EventCtor}).`)
    if (EventCtor.isHistoric())
      throw new Error(
        `${EventCtor.name} is an historic event which means it cannot be triggered anymore.`
      )

    this._version++
    const args = {
      entityUid: this._uid,
      entityVersion: this._version,
      timestamp: new Date(),
      isBeingReplayed: false,
    }
    Object.assign(args, data)
    const event = new EventCtor(args)
    await this._eventStore.storeEvent(event)
    await this.applyEvent(event)
  }

  async applyEvent(event) {
    await this._eventDispatcher.dispatch(event)
    this._version = event.entityVersion
  }
}
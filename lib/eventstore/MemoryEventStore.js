module.exports = class MemoryEventStore {
  constructor() {
    this._events = []
  }

  async storeEvent(event) {
    this._events.push(event)
  }

  async findEventsByEntityUid(entityUid) {
    return this._events.filter(event => event.entityUid === entityUid)
  }
}
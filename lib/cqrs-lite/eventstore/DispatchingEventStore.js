module.exports = class DispatchingEventStore {
  constructor(eventStore, dispatchers) {
    this._eventStore = eventStore
    this._dispatchers = dispatchers
  }

  async storeEvent(event) {
    await this._eventStore.storeEvent(event)
    for(const dispatcher of this._dispatchers) {
      await dispatcher.dispatch(event)
    }
  }

  async findEventsByEntityUid(entityUid) {
    return this._eventStore.findEventsByEntityUid(entityUid)
  }
}
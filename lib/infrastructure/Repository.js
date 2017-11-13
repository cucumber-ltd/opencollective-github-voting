module.exports = class Repository {
  constructor(eventStore) {
    if(!eventStore) throw new Error('NPE')
    this._eventStore = eventStore
  }

  async load(EntityConstructor, entityUid) {
    const entity = new EntityConstructor(entityUid, this._eventStore)
    const events = await this._eventStore.findEventsByEntityUid(entityUid)
    for(const event of events) {
      entity.applyEvent(event)
    }
    return entity
  }
}
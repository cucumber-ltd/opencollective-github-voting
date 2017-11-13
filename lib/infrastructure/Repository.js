module.exports = class Repository {
  constructor(eventStore) {
    this._eventStore = eventStore
  }

  async create(EntityConstructor, entityUid) {
    return EntityConstructor.create(entityUid, this._eventStore)
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
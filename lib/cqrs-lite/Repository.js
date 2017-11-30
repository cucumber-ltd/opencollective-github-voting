module.exports = class Repository {
  constructor(eventStore) {
    this._eventStore = eventStore
  }

  async create(EntityConstructor, entityUid, eventAttributes) {
    if(!entityUid) throw new Error('Missing entityUid')
    const entity = new EntityConstructor(entityUid, this._eventStore)
    await entity.create(eventAttributes)
  }

  async load(EntityConstructor, entityUid) {
    const entity = new EntityConstructor(entityUid, this._eventStore)
    const events = await this._eventStore.findEventsByEntityUid(entityUid)
    for (const event of events) {
      await entity.applyEvent(event)
    }
    return entity
  }
}
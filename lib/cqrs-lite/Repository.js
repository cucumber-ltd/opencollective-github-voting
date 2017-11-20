const uuid = require('uuid/v4')

module.exports = class Repository {
  constructor(eventStore) {
    this._eventStore = eventStore
  }

  async create(EntityConstructor, eventAttributes) {
    const entityUid = uuid()
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
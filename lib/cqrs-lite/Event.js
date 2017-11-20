module.exports = class Event {
  constructor(entityUid, entityVersion, timestamp, data) {
    if (!entityUid) throw new Error('Missing entityUid')
    this._entityUid = entityUid
    this._entityVersion = entityVersion
    this._timestamp = timestamp
    this._data = data
  }

  get entityUid() {
    return this._entityUid
  }

  get entityVersion() {
    return this._entityVersion
  }

  get data() {
    return this._data
  }
}
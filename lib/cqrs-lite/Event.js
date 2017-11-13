module.exports = class Event {
  constructor(entityUid, entityVersion, timestamp, data) {
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
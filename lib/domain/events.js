class Event {
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

class AccountCreatedEvent extends Event {
}

class AccountCreditedEvent extends Event {
}

class AccountDebitedEvent extends Event {
}

module.exports = {
  AccountCreatedEvent,
  AccountCreditedEvent,
  AccountDebitedEvent
}
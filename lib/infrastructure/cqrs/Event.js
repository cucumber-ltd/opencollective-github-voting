'use strict'

const ValueObject = require('value-object')

let nextSequenceNumber = 0

class Event extends ValueObject {
  _init() {
    const data = Object.assign({}, this)
    delete data.entityUid
    delete data.entityVersion
    delete data.timestamp
    delete data.isBeingReplayed
    Object.defineProperty(this, 'sequenceNumber', {
      value: nextSequenceNumber++,
      writable: false,
      enumerable: false,
    })
    Object.defineProperty(this, 'data', {
      value: data,
      writable: false,
      enumerable: false,
    })
    Object.defineProperty(this, 'type', {
      value: this.constructor.name,
      writable: false,
      enumerable: false,
    })
  }

  static isHistoric() {
    return false
  }

  static get Historic() {
    return class extends this {
      static isHistoric() {
        return true
      }
    }
  }

  static define(properties) {
    const klass = class extends Event {
    }
    klass.properties = properties
    return klass
  }
}

Event.properties = {
  entityUid: 'string',
  entityVersion: 'number',
  timestamp: Date,
  isBeingReplayed: 'boolean',
}

module.exports = Event

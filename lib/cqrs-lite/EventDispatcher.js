module.exports = class EventDispatcher {
  constructor(target) {
    this._target = target
  }

  async dispatch(event) {
    const eventHandlerName = `on${event.constructor.name}`
    if (typeof this._target[eventHandlerName] === 'function') {
      const eventAttributes = Object.assign({}, event.data, { entityUid: event.entityUid })
      await this._target[eventHandlerName](eventAttributes)
    }
  }
}
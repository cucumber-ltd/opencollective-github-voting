module.exports = class EventDispatcher {
  constructor(target) {
    this._target = target
  }

  dispatch(event) {
    const eventHandlerName = `on${event.constructor.name}`
    if (typeof this._target[eventHandlerName] === 'function') {
      this._target[eventHandlerName](event.data)
    }
  }
}
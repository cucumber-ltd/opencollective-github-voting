module.exports = class EventDispatcher {
  dispatch(event, target) {
    const eventHandlerName = `on${event.constructor.name}`
    if (typeof target[eventHandlerName] === 'function') {
      target[eventHandlerName](event.data)
    }
  }
}
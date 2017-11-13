module.exports = class CommandBus {
  constructor(repository, eventStore) {
    this._repository = repository
    this._eventStore = eventStore
  }

  async dispatchCommand(command) {
    await command.constructor.process(this._repository, this._eventStore, command.attributes)
  }
}
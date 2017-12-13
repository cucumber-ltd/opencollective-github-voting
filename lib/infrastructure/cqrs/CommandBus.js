module.exports = class CommandBus {
  constructor(repository) {
    this._repository = repository
  }

  async dispatchCommand(command) {
    await command.constructor.process(this._repository, command)
  }
}
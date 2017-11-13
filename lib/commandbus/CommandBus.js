module.exports = class CommandBus {
  constructor(repository) {
    if(!repository) throw new Error('NPE')
    this._repository = repository
  }

  async dispatchCommand(command) {
    await command.constructor.process(this._repository, command.attributes)
  }
}
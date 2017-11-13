const CommandBus = require('./infrastructure/CommandBus')
const Repository = require('./infrastructure/Repository')
const VotingPort = require('./VotingPort')

module.exports = class Assembly {
  async start() {
    this.eventStore = this.makeEventStore()
    this.repository = new Repository(this.eventStore)
    this.commandBus = new CommandBus(this.repository)

    this.votingPort = new VotingPort(this.eventStore, this.repository, this.commandBus)
  }

  async stop() {
  }

  makeEventStore() {
    throw new Error('override makeEventStore')
  }
}
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const AccountProjection = require('./read/AccountProjection')
const VotingPort = require('./VotingPort')

module.exports = class Assembly {
  async start() {
    const accountProjection = new AccountProjection()
    const commandBus = buildCommandBus(this.makeEventStore(), [
      accountProjection
    ])

    this.votingPort = new VotingPort(commandBus, accountProjection)
  }

  async stop() {
  }

  makeEventStore() {
    throw new Error('override makeEventStore')
  }
}
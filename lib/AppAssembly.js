const MemoryEventStore = require('./cqrs-lite/eventstore/MemoryEventStore')
const buildCommandBus = require('./cqrs-lite/buildCommandBus')
const AccountProjection = require('./read/AccountProjection')
const AccountStore = require('./read/AccountStore')
const AccountCommands = require('./AccountCommands')
const TransferCommands = require('./TransferCommands')
const WebApp = require('./server/WebApp')

module.exports = class AppAssembly {
  constructor() {
    const eventStore = new MemoryEventStore()
    const accountStore = new AccountStore()
    const accountProjection = new AccountProjection(accountStore)
    const commandBus = buildCommandBus(eventStore, [
      accountProjection
    ])
    const accountCommands = new AccountCommands({ commandBus, accountStore })
    const transferCommands = new TransferCommands({ commandBus, accountStore })
    const webApp = new WebApp({ transferCommands, accountStore })

    this._accountStore = accountStore
    this._accountCommands = accountCommands
    this._transferCommands = transferCommands
    this._webApp = webApp
  }

  get accountStore() {
    return this._accountStore
  }

  get accountCommands() {
    return this._accountCommands
  }

  get transferCommands() {
    return this._transferCommands
  }

  get webApp() {
    return this._webApp
  }

  async start() {
  }

  async stop() {
  }
}
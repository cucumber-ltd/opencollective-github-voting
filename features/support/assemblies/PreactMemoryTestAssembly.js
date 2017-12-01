const PreactAssembly = require('../../../lib/PreactAssembly')
const ServerAssembly = require('../../../lib/ServerAssembly')
const BaseTestAssembly = require('./BaseTestAssembly')
const DomTestAssembly = require('../../../lib/DomTestAssembly')

module.exports = class PreactMemoryTestAssembly extends BaseTestAssembly {
  constructor() {
    super()
    const $domNode = document.body
    const serverAssembly = new ServerAssembly()
    const { transferCommands, accountQueries, sub } = serverAssembly
    const preactAssembly = new PreactAssembly({ $domNode, sub, transferCommands, accountQueries })

    const domTestAssembly = new DomTestAssembly({ $domNode, sub })

    this._contextAssembly = serverAssembly
    this._actionAssembly = domTestAssembly
    this._outcomeAssembly = domTestAssembly
    this._preactAssembly = preactAssembly
  }

  async start() {
    await this._preactAssembly.start()
  }

  async stop() {
  }
}
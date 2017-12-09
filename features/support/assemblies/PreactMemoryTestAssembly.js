const PreactAssembly = require('../../../lib/PreactAssembly')
const DomTestAssembly = require('./DomTestAssembly')
const BaseTestAssembly = require('./BaseTestAssembly')

module.exports = class PreactMemoryTestAssembly extends BaseTestAssembly {
  constructor() {
    super()
    this._actors = new Map()
  }

  async start() {
  }

  async stop() {
    // TODO: Unmount all the DomTestAssembly (which should delete generated nodes too)
  }

  async actor(accountHolder) {
    if (!this._actors.has(accountHolder)) {
      const accountHolderId = this.id(accountHolder)
      const $domNode = document.createElement('div')
      $domNode.id = `cucumber-actor-${accountHolder}`
      document.body.appendChild($domNode)

      const { sub, transferCommands, bankQueries } = this.context
      const preactAssembly = new PreactAssembly({ $domNode, accountHolderId, sub, transferCommands, bankQueries })
      await preactAssembly.start()
      const domTestAssembly = new DomTestAssembly({ $domNode, sub })
      this._actors.set(accountHolder, domTestAssembly)
    }
    return this._actors.get(accountHolder)
  }
}
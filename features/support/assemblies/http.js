const Assembly = require('../../../lib/Assembly')
const NullSignals = require('../../../test_support/NullSignals')
const WebApp = require('../../../lib/server/WebApp')
const HttpVotingPort = require('../../../lib/client/HttpVotingPort')

module.exports = class HttpAssembly extends Assembly {
  constructor() {
    super()
  }

  async start() {
    super.start()
    this._webApp = new WebApp({ votingPort: this._votingPort, serveClient: false })
    const port = await this._webApp.listen(0)
    this._httpVotingPort = new HttpVotingPort(`http://localhost:${port}`)
  }

  async stop() {
    await this._webApp.stop()

    await super.stop()
  }

  contextVotingPort() {
    return this.votingPort
  }

  actionVotingPort() {
    return this._httpVotingPort
  }

  outcomeVotingPort() {
    return this._httpVotingPort
  }

  _makeAccountSignals() {
    return new NullSignals()
  }
}
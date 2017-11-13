const Assembly = require('../../../lib/Assembly')
const WebApp = require('../../../lib/server/WebApp')
const HttpVotingPort = require('../../../lib/client/HttpVotingPort')

module.exports = class HttpAssembly extends Assembly {
  async start() {
    await super.start()

    this._webApp = new WebApp({ votingPort: this._votingPort, serveClient: false })
    const port = await this._webApp.listen(0)
    this._httpVotingPort = new HttpVotingPort(`http://localhost:${port}`)
  }

  async stop() {
    await this._webApp.stop()

    await super.stop()
  }

  contextVotingPort() {
    return this._votingPort
  }

  actionVotingPort() {
    return this._httpVotingPort
  }

  outcomeVotingPort() {
    return this._httpVotingPort
  }
}
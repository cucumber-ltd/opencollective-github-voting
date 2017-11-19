const TestAssembly = require('./TestAssembly')
const WebApp = require('../../../lib/server/WebApp')
const HttpVotingPort = require('../../../lib/client/HttpVotingPort')

// TODO: Extend from HttpAssembly - call this one HttpTestAssembly?
module.exports = class HttpAssembly extends TestAssembly {
  async start() {
    await super.start()
    const port = await this.webApp.listen(0)
    this._httpVotingPort = new HttpVotingPort(`http://localhost:${port}`)
  }

  async stop() {
    await this.webApp.stop()

    await super.stop()
  }

  get actionVotingPort() {
    return this._httpVotingPort
  }

  get outcomeAccountStore() {
    return this._httpVotingPort
  }
}
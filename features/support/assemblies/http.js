const fetch = require('node-fetch')
const TestAssembly = require('./TestAssembly')
const HttpVotingPort = require('../../../lib/client/HttpVotingPort')

module.exports = class HttpAssembly extends TestAssembly {
  async start() {
    await super.start()
    const port = await this.webApp.listen(0)
    this._httpVotingPort = new HttpVotingPort(`http://localhost:${port}`, fetch)
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
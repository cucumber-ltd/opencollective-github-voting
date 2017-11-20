const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const asyncExpress = require('../cqrs-lite/express/asyncExpress')

module.exports = class WebApp {
  constructor({ transferCommands, accountQueries }) {
    this._transferCommands = transferCommands
    this._accountQueries = accountQueries
  }

  async buildApp() {
    const app = express()
    app.use(express.static('./public'))
    app.use(bodyParser.json())
    const asyncApp = asyncExpress(app)

    asyncApp.post('/transfers', async (req, res) => {
      const { fromAccountNumber, toAccountNumber, amount } = req.body
      await this._transferCommands.transfer(fromAccountNumber, toAccountNumber, amount)
      res.status(201).end()
    })

    asyncApp.get('/accounts/:owner/:currency', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const accountNumber = { owner: req.params.owner, currency: req.params.currency }
      const account = await this._accountQueries.getAccount(accountNumber)
      res.status(200).end(JSON.stringify(account))
    })

    return app
  }

  // TODO: Extract to framework - WebServer
  async listen(port) {
    const app = await this.buildApp()
    this._server = http.createServer(app)
    return new Promise((resolve, reject) => {
      this._server.listen(port, err => {
        if (err) return reject(err)
        resolve(this._server.address().port)
      })
    })
  }

  async stop() {
    await new Promise((resolve, reject) => {
      this._server.close(err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
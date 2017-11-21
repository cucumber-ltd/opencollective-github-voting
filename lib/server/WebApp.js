const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const asyncExpress = require('../cqrs-lite/express/asyncExpress')
const pubsubRouter = require('../cqrs-lite/express/pubSubRouter')

module.exports = class WebApp {
  constructor({ transferCommands, accountQueries }) {
    this._transferCommands = transferCommands
    this._accountQueries = accountQueries
  }

  async buildApp() {
    const app = express()
    app.use(express.static('./public'))
    app.use(bodyParser.json())
    app.use('/pubsub', pubsubRouter(this._accountQueries))

    const asyncApp = asyncExpress(app)

    // TODO: Extract to TransferCommandsRoutes
    asyncApp.post('/transfers', async (req, res) => {
      const { fromAccountNumber, toAccountNumber, amount } = req.body
      await this._transferCommands.transfer(fromAccountNumber, toAccountNumber, amount)
      res.status(201).end()
    })

    // TODO: Extract to AccountQueriesRoutes
    asyncApp.get('/accounts/:owner/:currency', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const { owner, currency } = req.params
      const accountNumber = { owner, currency }
      const account = await this._accountQueries.getAccount(accountNumber)
      res.status(200).end(JSON.stringify(account))
    })

    // TODO: Extract to AccountQueriesRoutes
    asyncApp.get('/accounts/:currency', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const { currency } = req.params
      const accounts = await this._accountQueries.getAccounts(currency)
      res.status(200).end(JSON.stringify(accounts))
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

        this._sockets = []
        this._server.on('connection', socket => {
          this._sockets.push(socket)
          socket.on('close', () => {
            this._sockets.splice(this._sockets.indexOf(socket), 1)
          })
        })

        resolve(this._server.address().port)
      })
    })
  }

  async stop() {
    for (const socket of this._sockets) {
      socket.destroy()
    }
    await new Promise((resolve, reject) => {
      this._server.close(err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}
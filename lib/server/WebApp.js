const http = require('http')
const express = require('express')
const SseStream = require('ssestream')
const uuid = require('uuid/v4')
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

    const sseByConnectionId = new Map()

    app.get('/pubsub', (req, res) => {
      const sse = new SseStream(req)
      sse.pipe(res)
      const connectionId = uuid()
      sse.write({ event: 'connectionId', data: connectionId })

      sseByConnectionId.set(connectionId, sse)

      req.on('close', () => {
        sseByConnectionId.delete(connectionId)
        sse.unpipe(res)
        res.end()
      })
    })

    asyncApp.post('/pubsub/:connectionId/:subscriberId', async (req, res) => {
      const { connectionId, subscriberId } = req.params
      // We get the topic from the body because it may be a "rich" object that cannot be represented as a string
      const topic = req.body
      const sse = sseByConnectionId.get(connectionId)
      if (!sse) return res.status(404).end()

      await this._accountQueries.subscribe(topic, async message => {
        const data = {
          subscriberId,
          message,
        }

        sse.write({
          event: 'pubsub-message',
          data
        })
      })

      res.status(201).end()
    })

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
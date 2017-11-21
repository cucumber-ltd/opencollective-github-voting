const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const pubsubRouter = require('../cqrs-lite/express/pubSubRouter')
const transferCommandsRoutes = require('./transferCommandsRoutes')
const accountQueriesRoutes = require('./accountQueriesRoutes')

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
    app.use('/transfers', transferCommandsRoutes(this._transferCommands))
    app.use('/accounts', accountQueriesRoutes(this._accountQueries))
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
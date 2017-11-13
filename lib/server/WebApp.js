const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const asyncExpress = require('./asyncExpress')

module.exports = class WebApp {
  constructor({ votingPort, serveClient }) {
    this._votingPort = votingPort
    this._serveClient = serveClient
  }

  async buildApp() {
    const app = express()
    app.use(bodyParser.json())
    const asyncApp = asyncExpress(app)

    asyncApp.post('/transfers', async (req, res) => {
      const { fromAccountName, toAccountName, amount } = req.body
      await this._votingPort.transfer(fromAccountName, toAccountName, amount)
      res.status(201).end()
    })

    asyncApp.get('/accounts/:accountName', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const balance = await this._votingPort.getBalance(req.params.accountName)
      res.status(200).end(JSON.stringify(balance))
    })

    return app
  }

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
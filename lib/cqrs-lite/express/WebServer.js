const http = require('http')

/**
 * Node HTTP server with promise API.
 * Closes all open HTTP connections (typically EventSource and keepalive) on stop()
 */
module.exports = class WebServer {
  constructor(app) {
    this._app = app
  }

  async listen(port) {
    this._server = http.createServer(this._app)

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
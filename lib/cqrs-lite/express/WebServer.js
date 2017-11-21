const http = require('http')
const { promisify } = require('util')

/**
 * Node HTTP server with promise API.
 * Closes all open HTTP connections (typically EventSource and keepalive) on stop()
 */
module.exports = class WebServer {
  constructor(app) {
    this._app = app
  }

  /**
   * Start listening for requests on the specified port.
   * Pass 0 as port to listen to a random available port.
   *
   * @param port
   * @returns {Promise<number>} the port actually listened to
   */
  async listen(port) {
    this._server = http.createServer(this._app)
    const listen = promisify(this._server.listen.bind(this._server))
    await listen(port)

    this._sockets = []
    this._server.on('connection', socket => {
      this._sockets.push(socket)
      socket.on('close', () => {
        this._sockets.splice(this._sockets.indexOf(socket), 1)
      })
    })
    return this._server.address().port
  }

  async stop() {
    for (const socket of this._sockets) {
      socket.destroy()
    }
    const close = promisify(this._server.close.bind(this._server))
    await close()
  }
}
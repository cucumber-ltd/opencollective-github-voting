const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const EventSource = require('eventsource')
const RestClient = require('../rest-client/RestClient')
const EventSourceSub = require('./EventSourceSub')
const pubSubRouter = require('./subRouter')
const WebServer = require('../express-extensions/WebServer')
const verifyContract = require('./verifyPubSubContract')

describe('EventSourceSub', () => {
  let webServer

  verifyContract(async ({ sub }) => {
    const webApp = express()
    // subscription keys can be either JSON or strings
    webApp.use(bodyParser.json())
    webApp.use(bodyParser.text())
    webApp.use(pubSubRouter({ sub }))
    webServer = new WebServer(webApp)
    const port = await webServer.listen(0)
    const baseUrl = `http://localhost:${port}`
    const restClient = new RestClient({ baseUrl, fetch, EventSource })
    return new EventSourceSub({ restClient })
  })

  afterEach(async () => {
    await webServer.stop()
  })
})
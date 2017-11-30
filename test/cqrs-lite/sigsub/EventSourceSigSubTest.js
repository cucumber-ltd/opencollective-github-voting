const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const EventSource = require('eventsource')
const RestClient = require('../../../lib/cqrs-lite/rest/RestClient')
const EventSourceSigSub = require('../../../lib/cqrs-lite/sigsub/EventSourceSigSub')
const sigSubRouter = require('../../../lib/cqrs-lite/sigsub/sigSubRouter')
const WebServer = require('../../../lib/cqrs-lite/express/WebServer')
const verifyContract = require('./verifySigSubContract')

describe('EventSourceSigSub', () => {
  let webServer

  verifyContract(async (sigSub) => {
    const webApp = express()
    // subscription keys can be either JSON or strings
    webApp.use(bodyParser.json())
    webApp.use(bodyParser.text())
    webApp.use(sigSubRouter(sigSub))

    webServer = new WebServer(webApp)
    const port = await webServer.listen(0)
    const baseUrl = `http://localhost:${port}`
    const restClient = new RestClient(baseUrl, fetch, EventSource)
    return new EventSourceSigSub(restClient)
  })

  afterEach(async () => {
    await webServer.stop()
  })
})
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const EventSource = require('eventsource')
const RestClient = require('../../../lib/cqrs-lite/rest/RestClient')
const EventSourcePubSub = require('../../../lib/cqrs-lite/pubsub/EventSourcePubSub')
const pubSubRouter = require('../../../lib/cqrs-lite/pubsub/pubSubRouter')
const WebServer = require('../../../lib/cqrs-lite/express/WebServer')
const verifyContract = require('./verifyPubSubContract')

describe('EventSourcePubSub', () => {
  let webServer

  verifyContract(async (pubSub) => {
    const webApp = express()
    // subscription keys can be either JSON or strings
    webApp.use(bodyParser.json())
    webApp.use(bodyParser.text())
    webApp.use(pubSubRouter(pubSub))
    webServer = new WebServer(webApp)
    const restClient = new RestClient({ fetch, EventSource })
    const port = await webServer.listen(0)
    const baseUrl = `http://localhost:${port}`
    await restClient.start({ baseUrl })
    return new EventSourcePubSub({ restClient })
  })

  afterEach(async () => {
    await webServer.stop()
  })
})
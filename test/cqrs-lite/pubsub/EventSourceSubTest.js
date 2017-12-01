const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const EventSource = require('eventsource')
const RestClient = require('../../../lib/cqrs-lite/rest/RestClient')
const EventSourceSub = require('../../../lib/cqrs-lite/pubsub/EventSourceSub')
const pubSubRouter = require('../../../lib/cqrs-lite/pubsub/pubSubRouter')
const WebServer = require('../../../lib/cqrs-lite/express/WebServer')
const verifyContract = require('./verifyPubSubContract')

describe('EventSourceSub', () => {
  let webServer, eventSourceSub

  // TODO: Use assemblies? Why not? It simplifies setup and reduces duplication between test code and app code.
  // it also improves confidence because we have less risk of bugs in test code when we rely on production
  // assemblies
  verifyContract(async ({ sub }) => {
    const webApp = express()
    // subscription keys can be either JSON or strings
    webApp.use(bodyParser.json())
    webApp.use(bodyParser.text())
    webApp.use(pubSubRouter({ sub }))
    webServer = new WebServer(webApp)
    const restClient = new RestClient({ fetch, EventSource })
    const port = await webServer.listen(0)
    const baseUrl = `http://localhost:${port}`
    await restClient.start({ baseUrl })
    eventSourceSub = new EventSourceSub({ restClient })
    await eventSourceSub.start()
    return eventSourceSub
  })

  afterEach(async () => {
    await eventSourceSub.stop()
    await webServer.stop()
  })
})
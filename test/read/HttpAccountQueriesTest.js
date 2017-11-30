const fetch = require('node-fetch')
const EventSource = require('eventsource')
const EventSourcePubSub = require('../../lib/cqrs-lite/pubsub/EventSourcePubSub')
const RestClient = require('../../lib/cqrs-lite/rest/RestClient')
const WebServer = require('../../lib/cqrs-lite/express/WebServer')
const makeWebApp = require('../../lib/server/makeWebApp')
const HttpAccountQueries = require('../../lib/client/HttpAccountQueries')
const verifyContract = require('./verifyAccountQueriesContract')

describe('HttpAccountQueries', () => {

  let webServer, eventSourcePubSub

  verifyContract(async ({ pubSub, accountStore }) => {
    const webApp = makeWebApp({ pubSub, accountQueries: accountStore })
    webServer = new WebServer(webApp)
    const port = await webServer.listen(0)
    const baseUrl = `http://localhost:${port}`
    const restClient = new RestClient({ fetch, EventSource })
    await restClient.start({ baseUrl })
    eventSourcePubSub = new EventSourcePubSub({ restClient })
    await eventSourcePubSub.start()
    return new HttpAccountQueries({ restClient, pubSub: eventSourcePubSub })
  })

  afterEach(async () => {
    await webServer.stop()
    await eventSourcePubSub.stop()
  })
})

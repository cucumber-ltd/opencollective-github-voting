const fetch = require('node-fetch')
const EventSource = require('eventsource')
const EventSourceSigSub = require('../../lib/cqrs-lite/sigsub/EventSourceSigSub')
const RestClient = require('../../lib/cqrs-lite/rest/RestClient')
const WebServer = require('../../lib/cqrs-lite/express/WebServer')
const makeWebApp = require('../../lib/server/makeWebApp')
const HttpAccountQueries = require('../../lib/client/HttpAccountQueries')
const verifyContract = require('./verifyAccountQueriesContract')

describe('HttpAccountQueries', () => {

  let webServer, eventSourceSigSub

  verifyContract(async ({ sigSub, accountStore }) => {
    const webApp = makeWebApp({ sigSub, accountQueries: accountStore })
    webServer = new WebServer(webApp)
    const port = await webServer.listen(0)
    const baseUrl = `http://localhost:${port}`
    const restClient = new RestClient(baseUrl, fetch, EventSource)
    eventSourceSigSub = new EventSourceSigSub(restClient)
    await eventSourceSigSub.start()
    return new HttpAccountQueries(restClient, eventSourceSigSub)
  })

  afterEach(async () => {
    await webServer.stop()
    await eventSourceSigSub.stop()
  })
})

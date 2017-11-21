const fetch = require('node-fetch')
const EventSource = require('eventsource')
const RestClient = require('../../lib/cqrs-lite/rest/RestClient')
const WebServer = require('../../lib/cqrs-lite/express/WebServer')
const makeWebApp = require('../../lib/server/makeWebApp')
const HttpAccountQueries = require('../../lib/client/HttpAccountQueries')
const verifyContract = require('./verifyAccountQueriesContract')

describe('HttpAccountQueries', () => {

  let webServer, httpAccountQueries

  verifyContract(async accountQueries => {
    const webApp = makeWebApp({ accountQueries })
    webServer = new WebServer(webApp)
    const port = await webServer.listen(0)
    const baseUrl = `http://localhost:${port}`
    const restClient = new RestClient(baseUrl, fetch, EventSource)
    httpAccountQueries = new HttpAccountQueries(restClient)
    return httpAccountQueries
  })

  afterEach(async () => {
    await webServer.stop()
    await httpAccountQueries.stop()
  })
})

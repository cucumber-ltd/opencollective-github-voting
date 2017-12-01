const fetch = require('node-fetch')
const EventSource = require('eventsource')
const RestClient = require('../cqrs-lite/rest/RestClient')
const WebServer = require('../cqrs-lite/express/WebServer')
const makeWebApp = require('../makeWebApp')
const HttpAccountQueries = require('./HttpAccountQueries')
const verifyContract = require('./verifyAccountQueriesContract')

describe('HttpAccountQueries', () => {

  let webServer

  verifyContract(async ({ sub, accountQueries }) => {
    const webApp = makeWebApp({ sub, accountQueries })
    webServer = new WebServer(webApp)
    const port = await webServer.listen(0)
    const baseUrl = `http://localhost:${port}`
    const restClient = new RestClient({ fetch, EventSource })
    await restClient.start({ baseUrl })
    return new HttpAccountQueries({ restClient })
  })

  afterEach(async () => {
    await webServer.stop()
  })
})

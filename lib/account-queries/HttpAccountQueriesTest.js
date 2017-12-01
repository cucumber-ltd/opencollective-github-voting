const fetch = require('node-fetch')
const EventSource = require('eventsource')
const RestClient = require('../infrastructure/rest-client/RestClient')
const WebServer = require('../infrastructure/express-extensions/WebServer')
const makeWebApp = require('../makeWebApp')
const HttpAccountQueries = require('./HttpAccountQueries')
const verifyContract = require('./verifyAccountQueriesContract')

describe('HttpAccountQueries', () => {

  let webServer

  verifyContract(async ({ sub, accountQueries }) => {
    // TODO: Use assemblies? Why not? It simplifies setup and reduces duplication between test code and app code.
    // it also improves confidence because we have less risk of bugs in test code when we rely on production
    // assemblies
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

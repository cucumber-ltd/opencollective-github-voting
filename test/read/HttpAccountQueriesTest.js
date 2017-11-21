const fetch = require('node-fetch')
const EventSource = require('eventsource')
const RestClient = require('../../lib/cqrs-lite/rest/RestClient')
const HttpAccountQueries = require('../../lib/client/HttpAccountQueries')
const WebApp = require('../../lib/server/WebApp')
const verifyContract = require('./verifyAccountQueriesContract')

describe('HttpAccountQueries', () => {

  let webApp, httpAccountQueries

  verifyContract(async accountQueries => {
    webApp = new WebApp({ accountQueries })
    const port = await webApp.listen(0)
    const baseUrl = `http://localhost:${port}`
    const restClient = new RestClient(baseUrl, fetch, EventSource)
    httpAccountQueries = new HttpAccountQueries(restClient)
    return httpAccountQueries
  })

  afterEach(async () => {
    await webApp.stop()
    await httpAccountQueries.stop()
  })
})

const RestClient = require('../cqrs-lite/rest/RestClient')
const ClientAssembly = require('./ClientAssembly')

const clientAssembly = new ClientAssembly({
  domNode: document.getElementById('voting'),
  restClient: new RestClient('', window.fetch.bind(window), window.EventSource)
})

clientAssembly.start()

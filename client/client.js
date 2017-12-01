const RestClient = require('../lib/cqrs-lite/rest/RestClient')
const PreactAssembly = require('../lib/PreactAssembly')

const preactAssembly = new PreactAssembly({
  domNode: document.getElementById('voting'),
  restClient: new RestClient('', window.fetch.bind(window), window.EventSource)
})

preactAssembly.start()

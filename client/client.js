const RestClient = require('../lib/infrastructure/rest-client/RestClient')
const HttpAssembly = require('../lib/HttpAssembly')
const PreactAssembly = require('../lib/PreactAssembly')
require("bulma/css/bulma.css")

async function start(accountHolderId) {
  const restClient = new RestClient({
    baseUrl: '',
    fetch: window.fetch.bind(window),
    EventSource: window.EventSource
  })
  const httpAssembly = new HttpAssembly({ restClient })

  const { sub, transferCommands, bankQueries } = httpAssembly

  const preactAssembly = new PreactAssembly({
    $domNode: document.getElementById('voting'),
    accountHolderId,
    sub,
    transferCommands,
    bankQueries
  })

  await httpAssembly.start()
  await preactAssembly.start()
}

start('ASLAK-ACCOUNT-HOLDER-ID')
  .then(() => console.log('READY'))
  .catch(err => console.error('ERROR', err))

const ClientAssembly = require('./ClientAssembly')

const clientAssembly = new ClientAssembly({
  domNode: document.getElementById('voting'),
  baseUrl: '', // relative to document
  fetch: window.fetch.bind(window)
})

clientAssembly.start()
  .then(() => console.log('Ready'))
  .catch(err => console.error('Error', err))
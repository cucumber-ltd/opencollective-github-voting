const asyncRouter = require('../infrastructure/express-extensions/asyncRouter')

module.exports = ({ bankQueries }) => {
  if (!bankQueries) throw new Error('Missing bankQueries')
  const router = asyncRouter()

  router.$get('/accounts/:id', async (req, res) => {
    const { id } = req.params
    const result = await bankQueries.getAccount(id)
    respond(result, res)
  })

  router.$get('/account-holders/:id', async (req, res) => {
    const { id } = req.params
    const result = await bankQueries.getAccountHolder(id)
    respond(result, res)
  })

  router.$get('/account-holders', async (req, res) => {
    const result = await bankQueries.getAccountHolders()
    respond(result, res)
  })

  return router
}

function respond(result, res) {
  if (result) {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).end(JSON.stringify(result))
  } else {
    res.status(404).end()
  }
}

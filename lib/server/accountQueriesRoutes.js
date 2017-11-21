const asyncRouter = require('../cqrs-lite/express/asyncRouter')

module.exports = accountQueries => {
  const router = asyncRouter()

  router.$get('/:owner/:currency', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const { owner, currency } = req.params
    const accountNumber = { owner, currency }
    const account = await accountQueries.getAccount(accountNumber)
    res.status(200).end(JSON.stringify(account))
  })

  router.$get('/:currency', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const { currency } = req.params
    const accounts = await accountQueries.getAccounts(currency)
    res.status(200).end(JSON.stringify(accounts))
  })

  return router
}
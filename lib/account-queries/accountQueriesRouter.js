const asyncRouter = require('../cqrs-lite/express/asyncRouter')

module.exports = accountQueries => {
  if(!accountQueries) throw new Error('Missing accountQueries')
  const router = asyncRouter()

  router.$get('/users/:username', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const { username } = req.params
    const user = await accountQueries.getUser(username)
    res.status(200).end(JSON.stringify(user))
  })

  router.$get('/accounts/:number/:currency', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const { number, currency } = req.params
    const accountNumber = { number, currency }
    const account = await accountQueries.getAccount(accountNumber)
    res.status(200).end(JSON.stringify(account))
  })

  router.$get('/accounts/:currency', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const { currency } = req.params
    const accounts = await accountQueries.getAccounts(currency)
    res.status(200).end(JSON.stringify(accounts))
  })

  return router
}
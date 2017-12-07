const asyncRouter = require('../infrastructure/express-extensions/asyncRouter')

module.exports = ({ transferCommands }) => {
  const router = asyncRouter()

  router.$post('/transfers', async (req, res) => {
    const { fromAccountId, toAccountId, amount } = req.body
    await transferCommands.transfer({ fromAccountId, toAccountId, amount })
    res.status(201).end()
  })

  return router
}
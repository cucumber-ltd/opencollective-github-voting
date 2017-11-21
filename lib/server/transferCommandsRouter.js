const asyncRouter = require('../cqrs-lite/express/asyncRouter')

module.exports = transferCommands => {
  const router = asyncRouter()

  router.$post('/', async (req, res) => {
    const { fromAccountNumber, toAccountNumber, amount } = req.body
    await transferCommands.transfer(fromAccountNumber, toAccountNumber, amount)
    res.status(201).end()
  })

  return router
}
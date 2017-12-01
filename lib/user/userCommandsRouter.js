const asyncRouter = require('../cqrs-lite/express/asyncRouter')

module.exports = userCommands => {
  const router = asyncRouter()

  router.$post('/users', async (req, res) => {
    const { username } = req.body
    await userCommands.createUser(username)
    res.status(201).end()
  })

  return router
}